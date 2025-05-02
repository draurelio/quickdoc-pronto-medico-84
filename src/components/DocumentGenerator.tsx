import React from 'react';
import { Button } from "@/components/ui/button";
import { PatientData } from "./PatientHeader";
import { PrescriptionItem } from "./PrescriptionTable";
import { MedicalFormData } from "./MedicalForm";
import { Card, CardContent } from "@/components/ui/card";
import { generateDocxFromTemplate } from "../utils/documentTemplate";
import { toast } from "@/components/ui/use-toast";
import { FileText } from "lucide-react";

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
  const checkRequiredFields = () => {
    if (!patientData.name) {
      toast({
        title: "Atenção",
        description: "Preencha pelo menos o nome do paciente antes de gerar o documento.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleGenerateDocx = async () => {
    try {
      if (!checkRequiredFields()) return;
      
      console.log("Dados do paciente:", patientData);
      console.log("Dados da prescrição:", prescriptionData);
      console.log("Dados médicos:", medicalData);
      
      await generateDocxFromTemplate({
        patient: patientData,
        prescriptions: prescriptionData,
        medical: medicalData,
      });
      
      toast({
        title: "Sucesso!",
        description: "Documento DOCX gerado com sucesso. O download iniciará automaticamente.",
      });
    } catch (error) {
      console.error("Erro ao gerar documento DOCX:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao gerar o documento DOCX. Por favor, tente novamente.",
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
            onClick={handleGenerateDocx}
            className="bg-green-600 hover:bg-green-700 text-lg py-6"
            size="lg"
          >
            <FileText className="mr-2" /> Gerar DOCX
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentGenerator;
