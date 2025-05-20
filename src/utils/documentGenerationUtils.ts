
import { PatientData } from "@/components/PatientHeader";
import { PrescriptionItem } from "@/components/PrescriptionTable";
import { MedicalFormData } from "@/components/MedicalForm";
import { toast } from "@/components/ui/use-toast";
import { generateDocxFromTemplate } from "./documentTemplate";
import { savePrescriptionToDatabase } from "./prescriptionDatabaseUtils";
import { checkRequiredFields } from "./documentValidation";

/**
 * Handles the complete document generation process including validation,
 * document creation and database storage
 */
export const handleDocumentGeneration = async (
  patientData: PatientData,
  prescriptionData: PrescriptionItem[],
  medicalData: MedicalFormData,
  userId: string | undefined
): Promise<boolean> => {
  try {
    if (!checkRequiredFields(patientData)) return false;
    
    console.log("Dados do paciente:", patientData);
    console.log("Dados da prescrição:", prescriptionData);
    console.log("Dados médicos:", medicalData);
    
    await generateDocxFromTemplate({
      patient: patientData,
      prescriptions: prescriptionData,
      medical: medicalData
    });
    
    // If user is logged in, save to the shared database
    if (userId) {
      await savePrescriptionToDatabase(userId, patientData, prescriptionData, medicalData);
    }
    
    toast({
      title: "Sucesso!",
      description: "Documento DOCX gerado com sucesso. O download iniciará automaticamente.",
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao gerar documento DOCX:", error);
    toast({
      title: "Erro",
      description: "Ocorreu um erro ao gerar o documento DOCX. Por favor, tente novamente.",
      variant: "destructive",
    });
    return false;
  }
};
