
import { PatientData } from "../PatientHeader";
import { toast } from "@/components/ui/use-toast";

export const validateDocumentData = (patientData: PatientData): boolean => {
  if (!patientData.name) {
    toast({
      title: "Atenção",
      description: "Preencha pelo menos o nome do paciente antes de gerar o documento.",
      variant: "destructive",
    });
    return false;
  }
  return true;
};
