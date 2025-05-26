import React from 'react';

import React from 'react';
import { Button } from '@/components/ui/button'; // Assuming a Button component exists
import { generatePrescriptionPdf } from '../../utils/generatePrescriptionPdf'; // Import the PDF generation function

// Define interfaces for patient and prescription data (can be moved to a shared types file)
interface PatientData {
  name: string;
  dob: string; // Assuming date of birth is available or can be fetched
  contact: string; // Assuming contact info is available or can be fetched
}

interface PrescriptionData {
  medication: string;
  dosage: string; // Assuming dosage is available or can be fetched
  time: string; // Assuming time is available or can be fetched
  route: string; // Assuming route is available or can be fetched
  observations: string; // Assuming observations are available or can be fetched
}

interface PrescriptionHistoryItemProps {
  prescription: {
    id: number;
    patientName: string;
    date: string; // This is the prescription date
    medication: string; // Primary medication for display
    // We'll need more detailed data for PDF generation
    fullPrescriptionData: PrescriptionData; // Contains all details for the PDF
    patientData: PatientData; // Contains patient details for the PDF
  };
  onViewDetails: (id: number) => void; // Function to handle viewing details
}

const PrescriptionHistoryItem: React.FC<PrescriptionHistoryItemProps> = ({ prescription, onViewDetails }) => {
  const handleDownloadPdf = () => {
    // Use the more detailed data for PDF generation
    generatePrescriptionPdf(prescription.patientData, prescription.fullPrescriptionData);
  };

  return (
    <tr>
      <td>{prescription.patientName}</td>
      <td>{prescription.date}</td>
      <td>{prescription.medication}</td>
      <td className="space-x-2">
        <Button variant="outline" size="sm" onClick={() => onViewDetails(prescription.id)}>View Details</Button>
        <Button variant="outline" size="sm" onClick={handleDownloadPdf}>Download PDF</Button>
      </td>
    </tr>
  );
};

export default PrescriptionHistoryItem;
