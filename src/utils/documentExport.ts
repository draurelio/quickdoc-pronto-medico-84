import type { DocumentData } from "./documentHtmlGenerator";
import { generateMedicalRecordHtml } from "./documentHtmlGenerator";
import { generateDocxFromTemplate } from "./documentTemplate";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle, WidthType, AlignmentType } from "docx";

// Function to generate and download PDF (using HTML to PDF conversion)
export const generateAndDownloadPdf = (data: DocumentData) => {
  const htmlContent = generateMedicalRecordHtml(data);
  
  // Create a Blob with the HTML content
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Create a link element
  const link = document.createElement('a');
  link.href = url;
  link.download = `prontuario_${data.patient.name?.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.html`;
  
  // Append the link to the document
  document.body.appendChild(link);
  
  // Click the link to trigger the download
  link.click();
  
  // Clean up
  URL.revokeObjectURL(url);
  document.body.removeChild(link);
};

// Function to generate and download DOCX
export const generateAndDownloadDocx = async (data: DocumentData) => {
  try {
    console.log("Iniciando geração do DOCX...");
    const { patient, prescriptions, medical } = data;
    console.log("Dados recebidos:", { patient, prescriptions, medical });
    
    // Create document
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Header with title
          new Paragraph({
            text: "PRONTUÁRIO MÉDICO",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          
          // Patient information table
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: `NOME: ${patient.name || ''}` })],
                    width: {
                      size: 50,
                      type: WidthType.PERCENTAGE,
                    },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: `IDADE: ${patient.age || ''} ANOS` })],
                    width: {
                      size: 20,
                      type: WidthType.PERCENTAGE,
                    },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: `DIH: ${patient.admissionDate || ''}` })],
                    width: {
                      size: 30,
                      type: WidthType.PERCENTAGE,
                    },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: `DIAGNÓSTICO: ${patient.diagnosis || ''}` })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: `ALERGIAS: ${patient.allergies || ''}` })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: `ORIGEM: ${patient.origin || ''}` })],
                  }),
                ],
              }),
            ],
          }),
          
          // Medical information
          new Paragraph({
            text: "ADMISSÃO MÉDICA",
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 400,
            },
          }),
          
          new Paragraph({ 
            text: "ADMISSÃO:", 
            children: [new TextRun({ text: "ADMISSÃO:", bold: true })],
            spacing: {
              after: 100,
            },
          }),
          new Paragraph({ 
            text: medical.admission || '',
            spacing: {
              after: 200,
            },
          }),
          
          new Paragraph({ 
            text: "COMORBIDADES:", 
            children: [new TextRun({ text: "COMORBIDADES:", bold: true })],
            spacing: {
              after: 100,
            },
          }),
          new Paragraph({ 
            text: medical.comorbidities || '',
            spacing: {
              after: 200,
            },
          }),
          
          new Paragraph({ 
            text: "MUC (MEDICAÇÃO EM USO CONTÍNUO):", 
            children: [new TextRun({ text: "MUC (MEDICAÇÃO EM USO CONTÍNUO):", bold: true })],
            spacing: {
              after: 100,
            },
          }),
          new Paragraph({ 
            text: medical.medicationReason || '',
            spacing: {
              after: 200,
            },
          }),
          
          new Paragraph({ 
            text: "EXAME FÍSICO:", 
            children: [new TextRun({ text: "EXAME FÍSICO:", bold: true })],
            spacing: {
              after: 100,
            },
          }),
          new Paragraph({ 
            text: medical.physicalExam || '',
            spacing: {
              after: 200,
            },
          }),
          
          new Paragraph({ 
            text: "ANÁLISE:", 
            children: [new TextRun({ text: "ANÁLISE:", bold: true })],
            spacing: {
              after: 100,
            },
          }),
          new Paragraph({ 
            text: medical.analysis || '',
            spacing: {
              after: 200,
            },
          }),
          
          new Paragraph({ 
            text: "CONDUTAS:", 
            children: [new TextRun({ text: "CONDUTAS:", bold: true })],
            spacing: {
              after: 100,
            },
          }),
          new Paragraph({ 
            text: medical.plans || '',
            spacing: {
              after: 200,
            },
          }),
          
          // Prescription table
          new Paragraph({
            text: "MEDICAÇÃO",
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 400,
              after: 200,
            },
          }),
          createPrescriptionTable(prescriptions),
          
          // Footer
          new Paragraph({
            text: `Documento gerado pelo QuickDoc: Pronto Médico em ${new Date().toLocaleDateString('pt-BR')}`,
            spacing: {
              before: 400,
            },
            alignment: AlignmentType.CENTER,
          }),
        ],
      }],
    });
    
    // Generate and download the document
    console.log("Gerando buffer do documento...");
    const buffer = await Packer.toBlob(doc);
    console.log("Buffer gerado com sucesso");
    
    const url = URL.createObjectURL(buffer);
    console.log("URL criada:", url);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `prontuario_${patient.name?.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.docx`;
    console.log("Link de download criado:", link.download);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log("Download iniciado");
  } catch (error) {
    console.error("Erro detalhado na geração do DOCX:", error);
    if (error instanceof Error) {
      console.error("Mensagem:", error.message);
      console.error("Stack:", error.stack);
    }
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
  
  // Add empty rows if needed (to get 18 rows total)
  const emptyRowsNeeded = Math.max(0, 18 - prescriptions.length);
  for (let i = 0; i < emptyRowsNeeded; i++) {
    const rowIndex = prescriptions.length + i + 1;
    rows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: rowIndex.toString(), alignment: AlignmentType.CENTER })] }),
          new TableCell({ children: [new Paragraph()] }),
          new TableCell({ children: [new Paragraph()] }),
          new TableCell({ children: [new Paragraph()] }),
          new TableCell({ children: [new Paragraph()] }),
          new TableCell({ children: [new Paragraph()] }),
          new TableCell({ children: [new Paragraph()] }),
        ],
      })
    );
  }
  
  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    rows,
  });
}
