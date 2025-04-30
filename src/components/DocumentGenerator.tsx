
import React from 'react';
import { Button } from "@/components/ui/button";
import { PatientData } from "./PatientHeader";
import { PrescriptionItem } from "./PrescriptionTable";
import { MedicalFormData } from "./MedicalForm";
import { Card, CardContent } from "@/components/ui/card";
import { generateAndDownloadPdf } from "../utils/documentUtils";
import { toast } from "@/components/ui/use-toast";
import { FileDown } from "lucide-react";

interface DocumentGeneratorProps {
  patientData: PatientData;
  prescriptionData: PrescriptionItem[];
  medicalData: MedicalFormData;
}

const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({
  patientData,
  prescriptionData,
  medicalData,
}) => {
  const handleGenerateDocument = () => {
    try {
      if (!patientData.name) {
        toast({
          title: "Atenção",
          description: "Preencha pelo menos o nome do paciente antes de gerar o documento.",
          variant: "destructive",
        });
        return;
      }
      
      generateAndDownloadPdf({
        patient: patientData,
        prescriptions: prescriptionData,
        medical: medicalData,
      });
      
      toast({
        title: "Sucesso!",
        description: "Documento gerado com sucesso. O download iniciará automaticamente.",
      });
    } catch (error) {
      console.error("Erro ao gerar documento:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao gerar o documento. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          <p className="text-center text-muted-foreground mb-4">
            Após preencher todos os campos necessários, clique no botão abaixo para gerar e baixar o prontuário médico.
          </p>
          <Button 
            onClick={handleGenerateDocument}
            className="bg-medblue-600 hover:bg-medblue-700 text-lg py-6 px-8"
            size="lg"
          >
            <FileDown className="mr-2" /> Gerar e Baixar Prontuário
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentGenerator;
