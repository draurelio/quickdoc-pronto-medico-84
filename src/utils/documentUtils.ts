
import { PatientData } from "../components/PatientHeader";
import { PrescriptionItem } from "../components/PrescriptionTable";
import { MedicalFormData } from "../components/MedicalForm";
import { Json } from '@/integrations/supabase/types';
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { formatDate } from './formatUtils';
import { OralMedication } from "../data/antibioticsData";
import { generateDocxFromTemplate } from "./documentTemplate";

interface DocumentData {
  patient: PatientData;
  prescription: PrescriptionItem[];
  medical: MedicalFormData;
  antibiotics?: OralMedication[];
}

export const savePrescriptionToDatabase = async (
  patientData: PatientData,
  prescriptionData: PrescriptionItem[],
  medicalData: MedicalFormData
) => {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session?.session?.user) {
      toast({
        title: "Atenção",
        description: "É necessário estar logado para salvar prescrições.",
        variant: "destructive",
      });
      return false;
    }
    
    // Fix: Convert complex objects to JSON-compatible format
    const { data, error } = await supabase
      .from('prescriptions')
      .insert({
        user_id: session.session.user.id,
        patient_name: patientData.name,
        patient_age: patientData.age,
        admission_date: patientData.admissionDate,
        diagnosis: patientData.diagnosis,
        prescription_data: prescriptionData as unknown as Json,
        medical_data: medicalData as unknown as Json,
        patient_data: patientData as unknown as Json
      });
    
    if (error) {
      console.error("Erro ao salvar prescrição:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a prescrição no histórico.",
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Sucesso!",
      description: "Prescrição salva no histórico com sucesso.",
    });
    return true;
  } catch (error) {
    console.error("Erro ao salvar prescrição:", error);
    toast({
      title: "Erro",
      description: "Ocorreu um erro ao salvar a prescrição no histórico.",
      variant: "destructive",
    });
    return false;
  }
};

export const generateMedicalRecordHtml = (data: DocumentData): string => {
  const headerHtml = `
    <div class="header">
      <h1>Pronto Atendimento</h1>
      <p>${formatDate(new Date().toISOString().slice(0, 10))}</p>
    </div>
  `;

  const patientInfoHtml = `
    <div class="section">
      <h2>Dados do Paciente</h2>
      <p><strong>Nome:</strong> ${data.patient.name}</p>
      <p><strong>Idade:</strong> ${data.patient.age}</p>
      <p><strong>Data de Internação:</strong> ${formatDate(data.patient.admissionDate)}</p>
    </div>
  `;

  const prescriptionHtml = data.prescription.length ? `
    <div class="section">
      <h2>Prescrição</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Medicação</th>
            <th>Dose</th>
            <th>Via</th>
            <th>Posologia</th>
            <th>Observação</th>
            <th>Horários</th>
          </tr>
        </thead>
        <tbody>
          ${data.prescription.map(item => `
            <tr>
              <td>${item.medication}</td>
              <td>${item.dose}</td>
              <td>${item.route}</td>
              <td>${item.frequency}</td>
              <td>${item.notes}</td>
              <td>${item.time}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  ` : '';

  const antibioticsHtml = data.antibiotics?.length ? `
    <div class="section">
      <h2>Antibióticos</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Medicação</th>
            <th>Dose</th>
            <th>Via</th>
            <th>Posologia</th>
            <th>Observação</th>
            <th>Horários</th>
          </tr>
        </thead>
        <tbody>
          ${data.antibiotics.map(antibiotic => `
            <tr>
              <td>${antibiotic.name}</td>
              <td>${antibiotic.dosage}</td>
              <td>${antibiotic.route}</td>
              <td>${antibiotic.posology}</td>
              <td>${antibiotic.observation || ''}</td>
              <td>${antibiotic.schedule || ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  ` : '';

  const medicalDataHtml = `
    <div class="section">
      <h2>Dados Médicos</h2>
      <p><strong>Admissão:</strong> ${data.medical.admission}</p>
      <p><strong>Comorbidades:</strong> ${data.medical.comorbidities}</p>
      <p><strong>MUC:</strong> ${data.medical.medicationReason}</p>
      <p><strong>Exame Físico:</strong> ${data.medical.physicalExam}</p>
      <p><strong>Análise:</strong> ${data.medical.analysis}</p>
      <p><strong>Condutas:</strong> ${data.medical.plans}</p>
    </div>
  `;

  const footerHtml = `
    <div class="footer">
      <p>Data: ${formatDate(new Date().toISOString().slice(0, 10))}</p>
    </div>
  `;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Pronto Atendimento - ${data.patient.name}</title>
        <style>
          /* ... existing styles ... */
        </style>
      </head>
      <body>
        <div class="container">
          ${headerHtml}
          ${patientInfoHtml}
          ${prescriptionHtml}
          ${antibioticsHtml}
          ${medicalDataHtml}
          ${footerHtml}
        </div>
      </body>
    </html>
  `;
};

export const handleGenerateDocument = async (
  patientData: PatientData,
  prescriptionData: PrescriptionItem[],
  medicalData: MedicalFormData
) => {
  try {
    console.log("Dados do paciente:", patientData);
    console.log("Dados da prescrição:", prescriptionData);
    console.log("Dados médicos:", medicalData);
    
    await generateDocxFromTemplate({
      patient: patientData,
      prescriptions: prescriptionData,
      medical: medicalData
    });
    
    // Salvar no banco de dados
    await savePrescriptionToDatabase(patientData, prescriptionData, medicalData);
    
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
