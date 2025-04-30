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
      <header className="bg-medblue-600 text-white py-2 px-6 shadow-md sticky top-0 z-10">
        <div className="container flex items-center">
          <img src="/lovable-uploads/hospital-logo.png" alt="Hospital Dr. Aurélio" className="h-14 mr-4" />
          <h1 className="text-2xl font-bold">QuickDoc: Prontuário Médico Hospital Dr. Aurélio</h1>
        </div>
      </header>
      
      <ScrollArea className="h-screen">
        <main className="container py-6 px-4 mb-20">
          <div className="max-w-6xl mx-auto space-y-6">
            <PatientHeader onDataChange={setPatientData} />
            <MedicalForm onDataChange={setMedicalData} />
            <PrescriptionTable onDataChange={setPrescriptionData} />
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
          QuickDoc: Prontuário Médico Hospital Dr. Aurélio &copy; {new Date().getFullYear()} - Sistema de Prontuário Médico Digital
        </div>
      </footer>
      
      <Toaster />
    </div>
  );
};

export default Index;
