import React from 'react';
import PrescriptionCreationForm from '../components/prescription/PrescriptionCreationForm';
import { generatePrescriptionPdf } from '../utils/generatePrescriptionPdf'; // Import the PDF generation function
import { Button } from '@/components/ui/button'; // Assuming a Button component exists

const PrescriptionCreation: React.FC = () => {
  // Placeholder data for patient and prescription
  const patientData = {
    name: "John Doe",
    dob: "1990-01-01",
    contact: "john.doe@example.com",
  };

  const prescriptionData = {
    medication: "Amoxicillin 250mg",
    dosage: "1 tablet",
    time: "Every 8 hours",
    route: "Oral",
    observations: "Take with food. Complete the full course.",
  };

  const handleGeneratePdf = () => {
    generatePrescriptionPdf(patientData, prescriptionData);
  };

  return (
    <div>
      <h1>Create New Prescription</h1>
      <PrescriptionCreationForm />
      <Button onClick={handleGeneratePdf} className="mt-4">
        Generate PDF
      </Button>
    </div>
  );
};

export default PrescriptionCreation;
