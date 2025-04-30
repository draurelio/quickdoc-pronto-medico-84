import { DocumentData } from "./documentHtmlGenerator";
import { saveAs } from "file-saver";
import { generateMedicalRecordHtml } from "./documentHtmlGenerator";
const htmlDocx = require('html-docx-js');

export const generateDocxFromTemplate = async (data: DocumentData) => {
  try {
    console.log("Iniciando geração do documento...");
    
    // Gerar o HTML do documento
    const htmlContent = generateMedicalRecordHtml(data);
    console.log("HTML gerado com sucesso");
    
    // Converter HTML para DOCX
    console.log("Convertendo para DOCX...");
    const docx = htmlDocx.asBlob(htmlContent, {
      orientation: 'portrait',
      margins: { top: 720, right: 720, bottom: 720, left: 720 }
    });
    
    // Salvar o arquivo
    const fileName = `prontuario_${data.patient.name?.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.docx`;
    console.log("Salvando arquivo:", fileName);
    saveAs(docx, fileName);
    
    console.log("Documento gerado com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro detalhado ao gerar documento DOCX:", error);
    if (error instanceof Error) {
      console.error("Mensagem de erro:", error.message);
      console.error("Stack trace:", error.stack);
    }
    throw error;
  }
}; 