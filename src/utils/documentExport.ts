import type { DocumentData } from "./documentHtmlGenerator";
import { generateMedicalRecordHtml } from "./documentHtmlGenerator";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle, WidthType, AlignmentType } from "docx";
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

// Function to generate and download PDF (using HTML to PDF conversion)
export const generateAndDownloadPdf = (data: DocumentData) => {
  const htmlContent = generateMedicalRecordHtml(data);
  
  // Create a Blob with the HTML content
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Create a link element
  const link = document.createElement('a');
  link.href = url;
  link.download = `prontuario_${data.patient.name?.replace(/\s+/g, '_')}_${new Date().toLocaleDateString('pt-BR')}.html`;
  
  // Append the link to the document
  document.body.appendChild(link);
  
  // Click the link to trigger the download
  link.click();
  
  // Clean up
  URL.revokeObjectURL(url);
  document.body.removeChild(link);
};

// Function to generate and download DOCX using template
export const generateAndDownloadDocx = async (data: DocumentData) => {
  try {
    const { patient, prescriptions, medical } = data;
    
    // Fetch the template file
    const response = await fetch('/modelo-prescricao.docx');
    const templateBuffer = await response.arrayBuffer();
    
    // Load the template into PizZip
    const zip = new PizZip(templateBuffer);
    
    // Create a new instance of Docxtemplater
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });
    
    // Prepare the data for the template
    const templateData = {
      nomedopaciente: patient.name || '',
      idade: patient.age || '',
      datainternacao: patient.admissionDate || '',
      dataHoje: new Date().toLocaleDateString('pt-BR'),
      diagnostico: patient.diagnosis || '',
      alergias: patient.allergies || '',
      origem: patient.origin || '',
      admissao: medical.admission || '',
      comorbidades: medical.comorbidities || '',
      muc: medical.medicationReason || '',
      exameFisico: medical.physicalExam || '',
      analise: medical.analysis || '',
      condutas: medical.plans || '',
    };

    // Add medication data
    for (let i = 1; i <= 18; i++) {
      const prescription = prescriptions[i - 1] || {
        medication: '',
        dose: '',
        route: '',
        frequency: '',
        notes: '',
      };
      templateData[`med${i}_nome`] = prescription.medication || '';
      templateData[`med${i}_dosagem`] = prescription.dose || '';
      templateData[`med${i}_via`] = prescription.route || '';
      templateData[`med${i}_posologia`] = prescription.frequency || '';
      templateData[`med${i}_obs`] = prescription.notes || '';
    }

    // Render the template with the data
    doc.render(templateData);
    
    // Generate the document as a blob
    const content = doc.getZip().generate({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    
    // Create download link
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prontuario_${patient.name?.replace(/\s+/g, '_')}_${new Date().toLocaleDateString('pt-BR')}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao gerar documento DOCX:', error);
    throw error;
  }
};

// Helper function to create the prescription table
function createPrescriptionTable(prescriptions: DocumentData['prescriptions']) {
  const rows = [
    // Header row
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ text: "#", alignment: AlignmentType.CENTER })] }),
        new TableCell({ children: [new Paragraph({ text: "MEDICAÇÃO", alignment: AlignmentType.CENTER })] }),
        new TableCell({ children: [new Paragraph({ text: "DOSE", alignment: AlignmentType.CENTER })] }),
        new TableCell({ children: [new Paragraph({ text: "VIA", alignment: AlignmentType.CENTER })] }),
        new TableCell({ children: [new Paragraph({ text: "POSOLOGIA", alignment: AlignmentType.CENTER })] }),
        new TableCell({ children: [new Paragraph({ text: "OBS.", alignment: AlignmentType.CENTER })] }),
        new TableCell({ children: [new Paragraph({ text: "HORÁRIO", alignment: AlignmentType.CENTER })] }),
      ],
      tableHeader: true,
    }),
  ];
  
  // Add rows for each prescription
  prescriptions.forEach((prescription, index) => {
    rows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: (index + 1).toString(), alignment: AlignmentType.CENTER })] }),
          new TableCell({ children: [new Paragraph({ text: prescription.medication || '' })] }),
          new TableCell({ children: [new Paragraph({ text: prescription.dose || '' })] }),
          new TableCell({ children: [new Paragraph({ text: prescription.route || '' })] }),
          new TableCell({ children: [new Paragraph({ text: prescription.frequency || '' })] }),
          new TableCell({ children: [new Paragraph({ text: prescription.notes || '' })] }),
          new TableCell({ children: [new Paragraph({ text: prescription.time || '' })] }),
        ],
      })
    );
  });
  
  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    rows,
  });
}
