import React from 'react';
import { Button } from "@/components/ui/button";
import { PatientData } from "./PatientHeader";
import { PrescriptionItem } from "./PrescriptionTable";
import { MedicalFormData } from "./MedicalForm";
import { Card, CardContent } from "@/components/ui/card";
import { generateDocxFromTemplate } from "../utils/documentTemplate";
import { toast } from "@/components/ui/use-toast";
import { FileText } from "lucide-react";
import { Antibiotic } from '../data/antibioticsData';
import { formatDate } from '../utils/formatUtils';
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

interface DocumentGeneratorProps {
  patientData: PatientData;
  prescriptionData: PrescriptionItem[];
  medicalData: MedicalFormData;
}

interface DocumentData {
  patient: PatientData;
  prescription: PrescriptionItem[];
  medical: MedicalFormData;
  antibiotics?: Antibiotic[];
}

const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({
  patientData,
  prescriptionData,
  medicalData,
}) => {
  const navigate = useNavigate();

  const checkRequiredFields = () => {
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

  const savePrescriptionToDatabase = async () => {
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
      
      const { data, error } = await supabase
        .from('prescriptions')
        .insert({
          user_id: session.session.user.id,
          patient_name: patientData.name,
          patient_age: patientData.age,
          admission_date: patientData.admissionDate,
          diagnosis: patientData.diagnosis,
          prescription_data: prescriptionData,
          medical_data: medicalData,
          patient_data: patientData
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

  const handleGenerateDocx = async () => {
    try {
      if (!checkRequiredFields()) return;
      
      console.log("Dados do paciente:", patientData);
      console.log("Dados da prescrição:", prescriptionData);
      console.log("Dados médicos:", medicalData);
      
      await generateDocxFromTemplate({
        patient: patientData,
        prescriptions: prescriptionData,
        medical: medicalData
      });
      
      // Salvar no banco de dados
      await savePrescriptionToDatabase();
      
      toast({
        title: "Sucesso!",
        description: "Documento DOCX gerado com sucesso. O download iniciará automaticamente.",
      });
    } catch (error) {
      console.error("Erro ao gerar documento DOCX:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao gerar o documento DOCX. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleViewHistory = () => {
    navigate("/historico");
  };

  const generateMedicalRecordHtml = (data: DocumentData): string => {
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
              <th>Medicamento</th>
              <th>Dosagem</th>
              <th>Via</th>
              <th>Posologia</th>
              <th>Horário</th>
            </tr>
          </thead>
          <tbody>
            ${data.prescription.map(item => `
              <tr>
                <td>${item.medication}</td>
                <td>${item.dose}</td>
                <td>${item.route}</td>
                <td>${item.frequency}</td>
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
              <th>Medicamento</th>
              <th>Dosagem</th>
              <th>Via</th>
              <th>Posologia</th>
              <th>Observação</th>
              <th>Horário</th>
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

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          <p className="text-center text-muted-foreground mb-4">
            Após preencher todos os campos necessários, clique no botão abaixo para gerar e baixar o prontuário médico.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleGenerateDocx}
              className="bg-green-600 hover:bg-green-700 text-lg py-6"
              size="lg"
            >
              <FileText className="mr-2" /> GERAR PRESCRIÇÃO
            </Button>
            <Button 
              onClick={handleViewHistory}
              className="bg-blue-600 hover:bg-blue-700 text-lg py-6"
              size="lg"
              variant="outline"
            >
              HISTÓRICO DE PRESCRIÇÕES
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentGenerator;
