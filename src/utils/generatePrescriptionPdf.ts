import jsPDF from 'jspdf';

// Define interfaces for patient and prescription data
interface PatientData {
  name: string;
  dob: string;
  contact: string;
}

interface PrescriptionData {
  medication: string;
  dosage: string;
  route: string;
  frequency: string; // New field
  duration: string;  // New field
  observations: string; // This will map from 'instructions' in MedicalPrescription.tsx
  time?: string; // Kept if existing PDF logic uses it, will be populated by frequency
}

export const generatePrescriptionPdf = (patientData: PatientData, prescriptionData: PrescriptionData) => {
  const doc = new jsPDF();

  // Doctor's Information (Placeholder)
  doc.setFontSize(12);
  doc.text("Doctor's Information:", 10, 10);
  doc.text("Name: Dr. Placeholder", 10, 20);
  doc.text("CRM: 123456", 10, 30);
  doc.text("Specialty: General Medicine", 10, 40);

  // Patient's Information
  doc.text("Patient's Information:", 10, 60);
  doc.text(`Name: ${patientData.name}`, 10, 70);
  doc.text(`Date of Birth: ${patientData.dob}`, 10, 80);
  doc.text(`Contact: ${patientData.contact}`, 10, 90);

  // Prescription Details
  doc.text("Prescription Details:", 10, 110);
  doc.text(`Medication: ${prescriptionData.medication}`, 10, 120);
  doc.text(`Dosage: ${prescriptionData.dosage}`, 10, 130);
  doc.text(`Route: ${prescriptionData.route}`, 10, 140);
  doc.text(`Frequency: ${prescriptionData.frequency}`, 10, 150); // Changed from Time to Frequency
  doc.text(`Duration: ${prescriptionData.duration}`, 10, 160);   // Added Duration
  doc.text(`Instructions/Observations: ${prescriptionData.observations}`, 10, 170); // Changed label

  // Placeholder for Digital Signature or QR Code
  doc.text("Digital Signature / QR Code Placeholder", 10, 190); // Adjusted y-position

  // Format date for filename (YYYY-MM-DD)
  const date = new Date().toISOString().slice(0, 10);
  const filename = `Prescription_${patientData.name.replace(/\s+/g, '_')}_${date}.pdf`;

  // Save or open the PDF
  doc.save(filename); // Downloads the PDF with the new naming convention
  // To open in a new tab: doc.output('dataurlnewwindow');
};
