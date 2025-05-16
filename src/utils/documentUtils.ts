
// Main document utility file - acts as an export point for document-related functions
import { PatientData } from "../components/PatientHeader";
import { PrescriptionItem } from "../components/PrescriptionTable";
import { MedicalFormData } from "../components/MedicalForm";
import { toast } from "@/components/ui/use-toast";
import { DocumentData } from './documentHtmlGenerator';
import { generateDocxFromTemplate } from './documentTemplate';

// Re-export interfaces and functions from the specialized utility files
export { formatDate } from './formatUtils';
export type { DocumentData } from './documentHtmlGenerator';
export { generateMedicalRecordHtml } from './documentHtmlGenerator';
export { generateAndDownloadPdf } from './documentExport';
export { generateAndDownloadDocx } from './documentExport';
export { generateDocxFromTemplate } from './documentTemplate';

// Handle document generation
export const handleGenerateDocument = async (
  patientData: PatientData,
  prescriptionData: PrescriptionItem[],
  medicalData: MedicalFormData
): Promise<void> => {
  try {
    console.log("Generating document...");
    
    // Using generateDocxFromTemplate to generate the document
    await generateDocxFromTemplate({
      patient: patientData,
      prescriptions: prescriptionData,
      medical: medicalData
    });
    
    toast({
      title: "Sucesso!",
      description: "Documento gerado com sucesso. O download iniciará automaticamente.",
    });
  } catch (error) {
    console.error("Erro ao gerar documento:", error);
    toast({
      title: "Erro",
      description: "Ocorreu um erro ao gerar o documento. Por favor, tente novamente.",
      variant: "destructive",
    });
  }
};
