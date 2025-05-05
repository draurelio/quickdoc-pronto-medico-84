import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Antibiotic } from './data/antibioticsData';
import { PatientData } from './types/patient';
import { PrescriptionItem } from './types/prescription';
import { MedicalFormData } from './types/medical';
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import PrescriptionForm from "@/components/PrescriptionForm";

const queryClient = new QueryClient();

const App: React.FC = () => {
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [prescriptionData, setPrescriptionData] = useState<PrescriptionItem[]>([]);
  const [medicalData, setMedicalData] = useState<MedicalFormData | null>(null);
  const [selectedAntibiotics, setSelectedAntibiotics] = useState<Antibiotic[]>([]);

  const handlePrescriptionSubmit = (data: any) => {
    setPrescriptionData(data.prescription);
    setSelectedAntibiotics(data.antibiotics || []);
  };

  const handleGenerateDocument = () => {
    if (!patientData || !prescriptionData || !medicalData) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os dados necessários",
        variant: "destructive",
      });
      return;
    }

    const documentData = {
      patient: patientData,
      prescription: prescriptionData,
      medical: medicalData,
      antibiotics: selectedAntibiotics
    };

    // ... rest of the code ...
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
