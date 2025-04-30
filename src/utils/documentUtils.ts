
// Main document utility file - acts as an export point for document-related functions
import { PatientData } from "../components/PatientHeader";
import { PrescriptionItem } from "../components/PrescriptionTable";
import { MedicalFormData } from "../components/MedicalForm";

// Re-export interfaces and functions from the specialized utility files
export { formatDate } from './formatUtils';
export { generateMedicalRecordHtml, DocumentData } from './documentHtmlGenerator';
export { generateAndDownloadPdf } from './documentExport';
