
import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import PatientHeader, { PatientData } from '@/components/PatientHeader';
import PrescriptionTable, { PrescriptionItem } from '@/components/PrescriptionTable';
import MedicalForm, { MedicalFormData } from '@/components/MedicalForm';
import DocumentGenerator from '@/components/DocumentGenerator';
import { Toaster } from "@/components/ui/toaster";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const [patientData, setPatientData] = useState<PatientData>({
    name: '',
    age: '',
    admissionDate: '',
    currentDate: new Date().toISOString().split('T')[0],
    diagnosis: '',
    allergies: '',
    origin: '',
  });

  const [prescriptionData, setPrescriptionData] = useState<PrescriptionItem[]>([
    { 
      id: '1', 
      medication: '', 
      dose: '', 
      route: '', 
      frequency: '', 
      notes: '', 
      time: '' 
    }
  ]);

  const [medicalData, setMedicalData] = useState<MedicalFormData>({
    admission: '',
    comorbidities: '',
    medicationReason: '',
    physicalExam: '',
    analysis: '',
    plans: '',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="header-gradient text-white py-3 px-6 shadow-md sticky top-0 z-10">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/lovable-uploads/hospital-logo.png" alt="Hospital Dr. Aurélio" className="h-14" />
            <h1 className="text-2xl font-bold">QuickDoc: Prontuário Médico</h1>
          </div>
          <div className="text-sm text-white/80">
            Hospital Dr. Aurélio
          </div>
        </div>
      </header>
      
      <ScrollArea className="h-screen">
        <main className="container py-8 px-4 mb-20">
          <div className="max-w-6xl mx-auto space-y-8">
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-medblue-100 to-medblue-50 p-4">
                <h2 className="text-lg font-semibold text-medblue-800">Dados do Paciente</h2>
              </div>
              <CardContent className="p-6">
                <PatientHeader onDataChange={setPatientData} />
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-medblue-100 to-medblue-50 p-4">
                <h2 className="text-lg font-semibold text-medblue-800">Avaliação Médica</h2>
              </div>
              <CardContent className="p-6">
                <MedicalForm onDataChange={setMedicalData} />
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-medblue-100 to-medblue-50 p-4">
                <h2 className="text-lg font-semibold text-medblue-800">Prescrição Médica</h2>
              </div>
              <CardContent className="p-6">
                <PrescriptionTable onDataChange={setPrescriptionData} />
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-medblue-100 to-medblue-50 p-4">
                <h2 className="text-lg font-semibold text-medblue-800">Gerar Documentação</h2>
              </div>
              <CardContent className="p-6">
                <DocumentGenerator 
                  patientData={patientData} 
                  prescriptionData={prescriptionData} 
                  medicalData={medicalData} 
                />
              </CardContent>
            </Card>
          </div>
        </main>
      </ScrollArea>
      
      <footer className="bg-white border-t py-6 px-6 text-center">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img src="/lovable-uploads/hospital-logo.png" alt="Hospital Dr. Aurélio" className="h-8" />
              <span className="text-gray-600 font-medium">Hospital Dr. Aurélio</span>
            </div>
            <div className="text-sm text-gray-500">
              QuickDoc: Prontuário Médico Digital &copy; {new Date().getFullYear()} - Todos os direitos reservados
            </div>
          </div>
        </div>
      </footer>
      
      <Toaster />
    </div>
  );
};

export default Index;
