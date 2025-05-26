import React from 'react';

import React from 'react';
import { Button } from '@/components/ui/button'; // Assuming a Button component exists
import { generatePrescriptionPdf } from '../../utils/generatePrescriptionPdf'; // Import the PDF generation function

import React from 'react';
import { Button } from '@/components/ui/button';
import { generatePrescriptionPdf } from '../../utils/generatePrescriptionPdf'; // Adjust path as needed

// Corresponds to patientData in generatePrescriptionPdf
interface PatientDataForPdf {
  name: string;
  dob: string;
  contact: string;
}

// Corresponds to prescriptionData in generatePrescriptionPdf
interface PrescriptionDataForPdf {
  medication: string;
  dosage: string;
  route: string;
  frequency: string;
  duration: string;
  observations: string; // Mapped from 'instructions' from DB
  time?: string; // Optional, as in generatePrescriptionPdf
}

interface PrescriptionHistoryItemProps {
  prescription: {
    id: number; // For key and potential detail view
    patientName: string; // For display
    date: string; // For display (prescription date)
    medication: string; // For display (primary medication name)
    
    // New fields for display in the history list itself
    frequency?: string; 
    duration?: string;

    // Full data needed for PDF generation
    fullPrescriptionData: PrescriptionDataForPdf;
    patientData: PatientDataForPdf;
  };
  onViewDetails: (id: number) => void; // For future detailed view
}

const PrescriptionHistoryItem: React.FC<PrescriptionHistoryItemProps> = ({ prescription, onViewDetails }) => {
  const handleDownloadPdf = () => {
    generatePrescriptionPdf(prescription.patientData, prescription.fullPrescriptionData);
  };

  return (
    <tr>
      <td className="py-2 px-4 border-b">{prescription.patientName}</td>
      <td className="py-2 px-4 border-b">{prescription.date}</td>
      <td className="py-2 px-4 border-b">{prescription.medication}</td>
      <td className="py-2 px-4 border-b">{prescription.frequency || "N/A"}</td> {/* Display frequency */}
      <td className="py-2 px-4 border-b">{prescription.duration || "N/A"}</td>   {/* Display duration */}
      <td className="py-2 px-4 border-b space-x-2">
        <Button variant="outline" size="sm" onClick={() => onViewDetails(prescription.id)}>
          View Details
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownloadPdf}>
          Download PDF
        </Button>
      </td>
    </tr>
  );
};

export default PrescriptionHistoryItem;
