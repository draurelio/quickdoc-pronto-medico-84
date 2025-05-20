
import { PatientData } from "@/components/PatientHeader";
import { PrescriptionItem } from "@/components/PrescriptionTable";
import { MedicalFormData } from "@/components/MedicalForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

/**
 * Saves a prescription to the Supabase database
 */
export const savePrescriptionToDatabase = async (
  userId: string,
  patientData: PatientData,
  prescriptionData: PrescriptionItem[],
  medicalData: MedicalFormData
): Promise<boolean> => {
  try {
    if (!userId) {
      toast({
        title: "Atenção",
        description: "É necessário estar logado para salvar prescrições no histórico compartilhado.",
        variant: "destructive",
      });
      return false;
    }
    
    // Supabase insert requires the correct format based on the database schema
    const { data, error } = await supabase
      .from('prescriptions')
      .insert([{  // Use array format for Supabase insert
        user_id: userId,
        patient_name: patientData.name,
        patient_age: patientData.age,
        admission_date: patientData.admissionDate,
        diagnosis: patientData.diagnosis,
        prescription_data: prescriptionData,
        medical_data: medicalData,
        patient_data: patientData
      }]);
    
    if (error) {
      console.error("Erro ao salvar prescrição:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a prescrição no histórico compartilhado.",
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Sucesso!",
      description: "Prescrição salva no histórico compartilhado com sucesso.",
    });
    return true;
  } catch (error) {
    console.error("Erro ao salvar prescrição:", error);
    toast({
      title: "Erro",
      description: "Ocorreu um erro ao salvar a prescrição no histórico compartilhado.",
      variant: "destructive",
    });
    return false;
  }
};
