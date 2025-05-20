
import React from 'react';
import { Button } from "@/components/ui/button";
import { PatientData } from "./PatientHeader";
import { PrescriptionItem } from "./PrescriptionTable";
import { MedicalFormData } from "./MedicalForm";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/hooks/useAuth';
import { handleDocumentGeneration } from "@/utils/documentGenerationUtils";

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
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleGenerateDocx = async () => {
    await handleDocumentGeneration(
      patientData, 
      prescriptionData, 
      medicalData,
      user?.id
    );
  };

  const handleViewHistory = () => {
    navigate("/historico");
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          <p className="text-center text-muted-foreground mb-4">
            Após preencher todos os campos necessários, clique no botão abaixo para gerar, baixar e compartilhar o prontuário médico.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleGenerateDocx}
              className="bg-green-600 hover:bg-green-700 text-lg py-6"
              size="lg"
            >
              <FileText className="mr-2" /> GERAR E COMPARTILHAR
            </Button>
            <Button 
              onClick={handleViewHistory}
              className="bg-blue-600 hover:bg-blue-700 text-lg py-6"
              size="lg"
              variant="outline"
            >
              HISTÓRICO COMPARTILHADO
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentGenerator;
