
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
// import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'; // DOCX generation disabled
// import { saveAs } from 'file-saver'; // DOCX generation disabled
import { useEffect, useState } from 'react'; // Standard useState import
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client'; 
import { generatePrescriptionPdf } from '@/utils/generatePrescriptionPdf';
import { loadMedicationsFromXLS } from '@/utils/medicationDataUtils';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // For Combobox
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"; // For Combobox
import { Check, ChevronsUpDown } from "lucide-react"; // Icons for Combobox
import { cn } from "@/lib/utils"; // Utility for class names

// Define interfaces
interface Patient {
  id: string;
  name: string;
  // Add other relevant patient fields if needed for PDF, e.g., dob, contact
  dob?: string; 
  contact?: string;
}

interface PrescriptionData {
  patientId: string;
  // patientName is part of the Patient object, so not strictly needed here if we have patientId
  // but can be kept for convenience if the form still uses it directly.
  // For PDF generation, we'll use the name from the selected Patient object.
  medication: string;
  dosage: string;
  route: string;
  frequency: string;
  duration: string;
  instructions: string;
}

const MedicalPrescription = () => {
  const [patientsList, setPatientsList] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [medicationSuggestions, setMedicationSuggestions] = useState<string[]>([]);
  const [isMedicationPopoverOpen, setIsMedicationPopoverOpen] = useState(false); // State for Popover
  // medicationSearchTerm is not strictly needed as CommandInput handles its own state for filtering
  const [formData, setFormData] = useState<PrescriptionData>({
    patientId: '',
    medication: '', // This will be the value for the Combobox input
    dosage: '',
    route: '',
    frequency: '',
    duration: '',
    instructions: ''
  });

  // Fetch patients and medications on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch Patients
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('id, name, dob, contact');

      if (patientError) {
        console.error('Error fetching patients:', patientError);
        toast({ title: "Error", description: "Failed to fetch patients.", variant: "destructive" });
        setPatientsList([]);
      } else {
        setPatientsList(patientData || []);
      }

      // Fetch Medications
      // Assuming cmed_lista.xls is in the public folder and accessible at this path
      const suggestions = await loadMedicationsFromXLS('/cmed_lista.xls', 'Sheet1', 'NOME_MEDICAMENTO');
      setMedicationSuggestions(suggestions);
      console.log("Loaded Medication Suggestions:", suggestions); // Log suggestions
    };

    fetchInitialData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Specific handler for medication input/combobox changes
  const handleMedicationChange = (value: string) => {
    setFormData((prev) => ({ ...prev, medication: value }));
  };

  const handleSelectChange = (fieldName: keyof PrescriptionData, value: string) => {
    if (fieldName === "patientId") {
      const patient = patientsList.find(p => p.id === value);
      setSelectedPatient(patient || null);
      setFormData((prev) => ({
        ...prev,
        patientId: value,
      }));
    } else {
      // This else block might not be needed if only patientId uses handleSelectChange directly
      setFormData((prev) => ({ ...prev, [fieldName]: value }));
    }
  };

  const savePrescription = async (prescriptionData: PrescriptionData, patient: Patient | null) => {
    if (!patient) {
      toast({ title: "Error", description: "No patient selected for saving.", variant: "destructive" });
      return { success: false, error: new Error("No patient selected"), savedData: null };
    }

    // Prepare data for Supabase, ensuring patient_id is included
    const dataToSave = {
      patient_id: prescriptionData.patientId, // Foreign key to patients table
      patient_name: patient.name, // Denormalizing patient_name for easier display in history, adjust if not desired
      medication: prescriptionData.medication,
      dosage: prescriptionData.dosage,
      route: prescriptionData.route,
      frequency: prescriptionData.frequency,
      duration: prescriptionData.duration,
      instructions: prescriptionData.instructions,
      date: new Date().toISOString(), // Add current date for the prescription
      // Ensure your 'prescriptions' table in Supabase has these columns
      // And patient_id is correctly set up as a foreign key if applicable.
    };

    console.log("Attempting to save prescription to Supabase:", dataToSave);

    const { data, error } = await supabase
      .from('prescriptions') // Your table name
      .insert([dataToSave])
      .select(); // .select() will return the inserted rows

    if (error) {
      console.error('Error saving prescription to Supabase:', error);
      toast({ title: "Save Error", description: error.message, variant: "destructive" });
      return { success: false, error, savedData: null };
    }

    console.log('Prescription saved successfully to Supabase:', data);
    toast({ title: "Success", description: "Prescription saved successfully!" });
    // Assuming 'data' is an array with the inserted record, return the first one
    return { success: true, error: null, savedData: data ? data[0] : null };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !formData.patientId) { // Ensure patientId is also set in formData
      toast({ title: "Error", description: "Please select a patient.", variant: "destructive" });
      return;
    }

    const { success, error, savedData } = await savePrescription(formData, selectedPatient);

    if (success && savedData) {
      // Use selectedPatient for patient details and savedData for prescription details for the PDF
      const patientForPdf = {
          name: selectedPatient.name,
          dob: selectedPatient.dob || "N/A",
          contact: selectedPatient.contact || "N/A",
      };
      // Map savedData (which should match formData fields) to what generatePrescriptionPdf expects
      const prescriptionForPdf = {
          medication: savedData.medication,
          dosage: savedData.dosage,
          route: savedData.route,
          frequency: savedData.frequency, 
          duration: savedData.duration,   
          observations: savedData.instructions, // Map instructions to observations for the PDF
      };

      generatePrescriptionPdf(patientForPdf, prescriptionForPdf);

      // Optionally reset the form
      setFormData({
        patientId: '',
        medication: '',
        dosage: '',
        route: '',
        frequency: '',
        duration: '',
        instructions: ''
      });
      setSelectedPatient(null); // Clear selected patient
    } else if (error) {
      // Error toast is already shown by savePrescription
      console.error("Failed to save prescription, PDF not generated.");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-medblue-600 mb-2">Receita Médica</h1>
        <p className="text-gray-600">Preencha os dados para criar uma nova receita médica.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-medblue-600">Dados da Receita</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6" as="form" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="patientId">Paciente (Selecionar)</Label>
            <Select
              name="patientId" // Keep name for consistency if needed, but value is primary for Select
              value={formData.patientId}
              onValueChange={(value) => handleSelectChange("patientId", value)} // Pass only value
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um paciente" />
              </SelectTrigger>
              <SelectContent>
                {patientsList.length === 0 && <SelectItem value="loading" disabled>Carregando pacientes...</SelectItem>}
                {patientsList.map(patient => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name} (ID: {patient.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Patient Name field can be removed or made read-only if always derived from selection */}
          {/* For now, it's kept as is, but not directly used for PDF if selectedPatient is available */}
          <div className="space-y-2">
            <Label htmlFor="patientNameInput">Nome do Paciente (Automático/Manual)</Label>
            <Input
              id="patientNameInput" // Changed id to avoid conflict if another 'patientName' element exists
              name="patientName" 
              value={selectedPatient ? selectedPatient.name : formData.patientId ? "Loading..." : ""} // Display selected patient's name
              onChange={handleInputChange} // Or disable if always auto-filled
              placeholder="Nome completo do paciente (será preenchido ao selecionar)"
              readOnly={!!selectedPatient} // Make read-only if a patient is selected
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="medication">Medicação</Label>
            <Popover open={isMedicationPopoverOpen} onOpenChange={setIsMedicationPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isMedicationPopoverOpen}
                  className="w-full justify-between"
                >
                  {formData.medication || "Selecione ou digite uma medicação..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  {/* 
                    The CommandInput value is managed internally by the Command component.
                    We update formData.medication when an item is selected or when the user types.
                    For direct typing, we can use the CommandInput's onValueChange if needed,
                    or rely on the fact that formData.medication is updated via handleMedicationChange
                    which is called by CommandInput's onChange if we wire it that way, or on select.
                  */}
                  <CommandInput 
                    placeholder="Buscar medicação..."
                    value={formData.medication} // Display current form value
                    onValueChange={(currentValue) => { // Update form data as user types
                      handleMedicationChange(currentValue);
                    }}
                  />
                  <CommandList>
                    <CommandEmpty>Nenhuma medicação encontrada.</CommandEmpty>
                    <CommandGroup>
                      {medicationSuggestions
                        .filter(suggestion => suggestion.toLowerCase().includes(formData.medication.toLowerCase()))
                        .map(suggestion => (
                          <CommandItem
                            key={suggestion}
                            value={suggestion} // value is important for Command's internal state
                            onSelect={(currentValue) => { // currentValue is the 'value' prop of CommandItem
                              handleMedicationChange(currentValue);
                              setIsMedicationPopoverOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.medication === suggestion ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {suggestion}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="dosage">Dosagem</Label>
              <Input
                id="dosage"
                name="dosage" // Ensure name attribute is set
                value={formData.dosage}
                onChange={handleInputChange}
                placeholder="Ex: 1 comprimido, 10 mL"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="route">Via de Administração</Label>
              <Input
                id="route"
                name="route" // Ensure name attribute is set
                value={formData.route}
                onChange={handleInputChange}
                placeholder="Ex: Oral, Intravenoso, Tópico"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequência</Label>
              <Input
                id="frequency"
                name="frequency" // Ensure name attribute is set
                value={formData.frequency}
                onChange={handleInputChange}
                placeholder="Ex: A cada 8 horas, 1x ao dia"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duração</Label>
              <Input
                id="duration"
                name="duration" // Ensure name attribute is set
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="Ex: Por 7 dias, Contínuo"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Instruções Adicionais</Label>
            <Textarea
              id="instructions"
              name="instructions" // Ensure name attribute is set
              value={formData.instructions}
              onChange={handleInputChange}
              placeholder="Ex: Tomar com alimentos. Evitar exposição ao sol."
              className="min-h-[100px]"
            />
          </div>

          <Button 
            type="submit" // Changed from onClick to type="submit" for form
            // onClick={handleSubmit} // onClick can be removed if type="submit" and onSubmit on form
            className="bg-medblue-600 hover:bg-medblue-700 text-lg py-6 w-full"
            size="lg"
            // disabled // Re-enable button for saving
          >
            <FileText className="mr-2" />
            Salvar Receita e Gerar PDF
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalPrescription;
