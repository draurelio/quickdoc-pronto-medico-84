import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import html2pdf from 'html2pdf.js';
import { generateMedicalRecordHtml, DocumentData } from './documentHtmlGenerator';
import { PatientData } from '@/components/PatientHeader';
import { PrescriptionItem } from '@/components/PrescriptionTable';
import { MedicalFormData } from '@/components/MedicalForm';
import { generateDocxFromTemplate } from './documentTemplate';
import { formatDate } from './formatUtils';

/**
 * Generates and downloads a PDF file from HTML content
 */
export const generateAndDownloadPdf = (documentData: DocumentData): void => {
  const { patient, prescriptions, medical } = documentData;
  
  const htmlContent = generateMedicalRecordHtml(documentData);
  
  const element = document.createElement('div');
  element.innerHTML = htmlContent;
  document.body.appendChild(element);

  const options = {
    margin: 10,
    filename: `prontuario_${patient.name.toLowerCase().replace(/\s+/g, '_')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(options).from(element).save().then(() => {
    document.body.removeChild(element);
  });
};

/**
 * Generates and downloads a DOCX file
 */
export const generateAndDownloadDocx = (
  documentData: DocumentData
): void => {
  const { patient, prescriptions, medical } = documentData;
  
  // Create a new document
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Header with hospital name
        new Paragraph({
          text: "Hospital Dr. Aurélio",
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: {
            after: 200
          },
        }),

        // Patient information section
        new Paragraph({
          text: "INFORMAÇÕES DO PACIENTE",
          heading: HeadingLevel.HEADING_2,
          alignment: AlignmentType.LEFT,
          spacing: {
            before: 200,
            after: 100
          }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Nome: ",
              bold: true,
            }),
            new TextRun(patient.name || "Não informado")
          ]
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Idade: ",
              bold: true,
            }),
            new TextRun(patient.age || "Não informada")
          ]
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Data de Admissão: ",
              bold: true,
            }),
            new TextRun(formatDate(patient.admissionDate) || "Não informada")
          ]
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Diagnóstico: ",
              bold: true,
            }),
            new TextRun(patient.diagnosis || "Não informado")
          ]
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Alergias: ",
              bold: true,
            }),
            new TextRun(patient.allergies || "Nenhuma informada")
          ]
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Procedência: ",
              bold: true,
            }),
            new TextRun(patient.origin || "Não informada")
          ],
          spacing: {
            after: 200
          }
        }),

        // Medical information section
        new Paragraph({
          text: "AVALIAÇÃO MÉDICA",
          heading: HeadingLevel.HEADING_2,
          alignment: AlignmentType.LEFT,
          spacing: {
            before: 200,
            after: 100
          }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "História da Doença Atual: ",
              bold: true,
            }),
            new TextRun(medical.admission || "Não informada")
          ],
          spacing: {
            after: 100
          }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Comorbidades: ",
              bold: true,
            }),
            new TextRun(medical.comorbidities || "Nenhuma informada")
          ],
          spacing: {
            after: 100
          }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Exame Físico: ",
              bold: true,
            }),
            new TextRun(medical.physicalExam || "Não informado")
          ],
          spacing: {
            after: 100
          }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Análise: ",
              bold: true,
            }),
            new TextRun(medical.analysis || "Não informada")
          ],
          spacing: {
            after: 100
          }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Planos: ",
              bold: true,
            }),
            new TextRun(medical.plans || "Não informados")
          ],
          spacing: {
            after: 200
          }
        }),

        // Prescription section
        new Paragraph({
          text: "PRESCRIÇÃO MÉDICA",
          heading: HeadingLevel.HEADING_2,
          alignment: AlignmentType.LEFT,
          spacing: {
            before: 200,
            after: 100
          }
        }),

        // Add each prescription item
        ...prescriptions.map((item) => {
          return new Paragraph({
            children: [
              new TextRun({
                text: `${item.medication || "Medicamento não informado"} - `,
              }),
              new TextRun({
                text: `${item.dose || "Dose não informada"}, `,
              }),
              new TextRun({
                text: `${item.route || "Via não informada"}, `,
              }),
              new TextRun({
                text: `${item.frequency || "Frequência não informada"} `,
              }),
              new TextRun({
                text: `(${item.time || "Horário não informado"})`,
              }),
              new TextRun({
                text: item.notes ? ` - ${item.notes}` : "",
              }),
            ],
            spacing: {
              after: 100
            }
          });
        }),

        // Footer with date
        new Paragraph({
          text: `Data: ${formatDate(patient.currentDate) || formatDate(new Date().toISOString().split('T')[0])}`,
          alignment: AlignmentType.RIGHT,
          spacing: {
            before: 400
          }
        }),
      ]
    }]
  });

  // Generate and save the docx file
  Packer.toBlob(doc).then(blob => {
    saveAs(blob, `prontuario_${patient.name.toLowerCase().replace(/\s+/g, '_')}.docx`);
  });
};
