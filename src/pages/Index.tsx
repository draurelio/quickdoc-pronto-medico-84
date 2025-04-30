
import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import PatientHeader, { PatientData } from '@/components/PatientHeader';
import PrescriptionTable, { PrescriptionItem } from '@/components/PrescriptionTable';
import MedicalForm, { MedicalFormData } from '@/components/MedicalForm';
import DocumentGenerator from '@/components/DocumentGenerator';
import { Toaster } from "@/components/ui/toaster";

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
      <header className="bg-medblue-600 text-white py-4 px-6 shadow-md sticky top-0 z-10">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/lovable-uploads/hospital-logo.png" alt="Hospital Logo" className="h-10" />
            <h1 className="text-2xl font-bold">QuickDoc: Pronto Médico</h1>
          </div>
          <div className="text-sm hidden md:block">Sistema de Prontuário Médico Digital</div>
        </div>
      </header>
      
      <ScrollArea className="h-screen">
        <main className="container py-6 px-4 mb-20">
          <div className="max-w-6xl mx-auto space-y-6">
            <PatientHeader onDataChange={setPatientData} />
            <PrescriptionTable onDataChange={setPrescriptionData} />
            <MedicalForm onDataChange={setMedicalData} />
            <DocumentGenerator 
              patientData={patientData} 
              prescriptionData={prescriptionData} 
              medicalData={medicalData} 
            />
          </div>
        </main>
      </ScrollArea>
      
      <footer className="bg-gray-100 border-t py-4 px-6 text-center text-sm text-gray-600">
        <div className="container">
          QuickDoc: Pronto Médico &copy; {new Date().getFullYear()} - Sistema de Prontuário Médico Digital
        </div>
      </footer>
      
      <Toaster />
    </div>
  );
};

export default Index;
