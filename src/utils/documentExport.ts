
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import html2pdf from 'html2pdf.js';
import { generateMedicalRecordHtml } from './documentHtmlGenerator';
import { PatientData } from '@/components/PatientHeader';
import { PrescriptionItem } from '@/components/PrescriptionTable';
import { MedicalFormData } from '@/components/MedicalForm';
import { generateDocxFromTemplate } from './documentTemplate';

/**
 * Generates and downloads a PDF file from HTML content
 */
export const generateAndDownloadPdf = (
  patientData: PatientData,
  prescriptionData: PrescriptionItem[],
  medicalData: MedicalFormData
): void => {
  const htmlContent = generateMedicalRecordHtml(patientData, prescriptionData, medicalData);
  
  const element = document.createElement('div');
  element.innerHTML = htmlContent;
  document.body.appendChild(element);

  const options = {
    margin: 10,
    filename: `prontuario_${patientData.name.toLowerCase().replace(/\s+/g, '_')}.pdf`,
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
  patientData: PatientData,
  prescriptionData: PrescriptionItem[],
  medicalData: MedicalFormData
): void => {
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
            new TextRun(patientData.name || "Não informado")
          ]
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Idade: ",
              bold: true,
            }),
            new TextRun(patientData.age || "Não informada")
          ]
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Data de Admissão: ",
              bold: true,
            }),
            new TextRun(patientData.admissionDate || "Não informada")
          ]
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Diagnóstico: ",
              bold: true,
            }),
            new TextRun(patientData.diagnosis || "Não informado")
          ]
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Alergias: ",
              bold: true,
            }),
            new TextRun(patientData.allergies || "Nenhuma informada")
          ]
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Procedência: ",
              bold: true,
            }),
            new TextRun(patientData.origin || "Não informada")
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
            new TextRun(medicalData.admission || "Não informada")
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
            new TextRun(medicalData.comorbidities || "Nenhuma informada")
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
            new TextRun(medicalData.physicalExam || "Não informado")
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
            new TextRun(medicalData.analysis || "Não informada")
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
            new TextRun(medicalData.plans || "Não informados")
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
        ...prescriptionData.map((item) => {
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
          text: `Data: ${patientData.currentDate || new Date().toISOString().split('T')[0]}`,
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
    saveAs(blob, `prontuario_${patientData.name.toLowerCase().replace(/\s+/g, '_')}.docx`);
  });
};
