
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { PatientData } from "./PatientHeader";
import { PrescriptionItem } from "./PrescriptionTable";
import { MedicalFormData } from "./MedicalForm";
import DocumentActions from "./document/DocumentActions";

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
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          <p className="text-center text-muted-foreground mb-4">
            Após preencher todos os campos necessários, clique no botão abaixo para gerar e baixar o prontuário médico.
          </p>
          <DocumentActions 
            patientData={patientData}
            prescriptionData={prescriptionData}
            medicalData={medicalData}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentGenerator;
