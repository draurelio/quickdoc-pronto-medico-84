
// Main document utility file - acts as an export point for document-related functions
import { PatientData } from "../components/PatientHeader";
import { PrescriptionItem } from "../components/PrescriptionTable";
import { MedicalFormData } from "../components/MedicalForm";

// Re-export interfaces and functions from the specialized utility files
export { formatDate } from './formatUtils';
export type { DocumentData } from './documentHtmlGenerator';
export { generateMedicalRecordHtml } from './documentHtmlGenerator';
export { generateAndDownloadPdf, generateAndDownloadDocx } from './documentExport';
