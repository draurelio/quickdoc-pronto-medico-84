import { DocumentData } from "./documentHtmlGenerator";
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';

export const generateDocxFromTemplate = async (data: DocumentData) => {
  try {
    console.log("Iniciando geração do documento com template...");
    
    // Carregar o arquivo de template
    const response = await fetch('/modelo-prescricao.docx');
    const templateContent = await response.arrayBuffer();
    
    // Criar um novo documento usando o template
    const zip = new PizZip(templateContent);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true
    });

    // Preparar os dados para o template
    const templateData = {
      nomedopaciente: data.patient.name || '',
      idade: data.patient.age || '',
      datainternacao: data.patient.admissionDate || '',
      dataHoje: data.patient.currentDate || '',
      diagnostico: data.patient.diagnosis || '',
      alergias: data.patient.allergies || '',
      origem: data.patient.origin || '',
      admissao: data.medical.admission || '',
      comorbidades: data.medical.comorbidities || '',
      muc: data.medical.medicationReason || '',
      examefisico: data.medical.physicalExam || '',
      analise: data.medical.analysis || '',
      condutas: data.medical.plans || '',
    };

    // Adicionar dados das medicações
    for (let i = 1; i <= 18; i++) {
      const prescription = data.prescriptions[i - 1] || {};
      templateData[`med${i}_nome`] = prescription.medication || '';
      templateData[`med${i}_dosagem`] = prescription.dose || '';
      templateData[`med${i}_via`] = prescription.route || '';
      templateData[`med${i}_posologia`] = prescription.frequency || '';
      templateData[`med${i}_obs`] = prescription.notes || '';
    }

    console.log("Dados preparados:", templateData);

    // Renderizar o documento
    doc.render(templateData);

    // Gerar o documento final
    const content = doc.getZip().generate({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });

    // Fazer o download do arquivo
    const fileName = `prontuario_${data.patient.name?.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.docx`;
    saveAs(content, fileName);
    
    console.log("Documento gerado com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao gerar documento:", error);
    throw error;
  }
}; 