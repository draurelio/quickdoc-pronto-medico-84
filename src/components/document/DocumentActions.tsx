
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PatientData } from "../PatientHeader";
import { PrescriptionItem } from "../PrescriptionTable";
import { MedicalFormData } from "../MedicalForm";
import { validateDocumentData } from "./DocumentValidator";
import { handleGenerateDocument } from "../../utils/documentUtils";

interface DocumentActionsProps {
  patientData: PatientData;
  prescriptionData: PrescriptionItem[];
  medicalData: MedicalFormData;
}

const DocumentActions: React.FC<DocumentActionsProps> = ({
  patientData,
  prescriptionData,
  medicalData
}) => {
  const navigate = useNavigate();

  const handleGenerateDocx = async () => {
    if (!validateDocumentData(patientData)) return;
    await handleGenerateDocument(patientData, prescriptionData, medicalData);
  };

  const handleViewHistory = () => {
    navigate("/historico");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Button 
        onClick={handleGenerateDocx}
        className="bg-green-600 hover:bg-green-700 text-lg py-6"
        size="lg"
      >
        <FileText className="mr-2" /> GERAR PRESCRIÇÃO
      </Button>
      <Button 
        onClick={handleViewHistory}
        className="bg-blue-600 hover:bg-blue-700 text-lg py-6"
        size="lg"
        variant="outline"
      >
        HISTÓRICO DE PRESCRIÇÕES
      </Button>
    </div>
  );
};

export default DocumentActions;
