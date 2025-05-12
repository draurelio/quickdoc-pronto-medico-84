
import { PatientData } from "../components/PatientHeader";
import { PrescriptionItem } from "../components/PrescriptionTable";
import { MedicalFormData } from "../components/MedicalForm";
import { formatDate } from "./formatUtils";

export interface DocumentData {
  patient: PatientData;
  prescriptions: PrescriptionItem[];
  medical: MedicalFormData;
}

// Generate HTML for the medical record document
export const generateMedicalRecordHtml = (data: DocumentData): string => {
  const { patient, prescriptions, medical } = data;
  
  // Format dates
  const formattedAdmissionDate = formatDate(patient.admissionDate);
  const formattedCurrentDate = formatDate(patient.currentDate);

  // Create prescription table rows
  const prescriptionRows = generatePrescriptionRows(prescriptions);
  const emptyRows = generateEmptyRows(prescriptions.length);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Prontuário Médico - ${patient.name}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.4;
          color: #333;
          margin: 20px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .logo {
          max-width: 300px;
          height: auto;
        }
        .patient-info-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
        }
        .patient-info-table td {
          border: 1px solid #000;
          padding: 4px 8px;
        }
        .medical-info {
          display: flex;
          flex-direction: column;
        }
        .medical-info-row {
          display: flex;
        }
        .medical-info-label {
          width: 150px;
          font-weight: bold;
          text-transform: uppercase;
          padding: 4px;
          border-left: 1px solid #ccc;
          border-right: 1px solid #ccc;
        }
        .prescription-table {
          width: 100%;
          border-collapse: collapse;
        }
        .prescription-table th, .prescription-table td {
          border: 1px solid #ccc;
          padding: 4px;
        }
        .prescription-table th {
          background-color: #e6e6e6;
          font-weight: bold;
          text-align: center;
        }
        .section-header {
          text-transform: uppercase;
          font-weight: bold;
          padding: 6px;
          background-color: #e6e6e6;
          text-align: center;
        }
        @media print {
          body {
            margin: 0;
            padding: 15px;
          }
          button {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div></div>
        <img src="/lovable-uploads/hospital-logo.png" alt="Hospital Dr. Aurélio" class="logo">
      </div>
      
      <table class="patient-info-table">
        <tr>
          <td style="width: 50%"><strong>NOME:</strong> ${patient.name || ''}</td>
          <td style="width: 20%"><strong>IDADE: ANOS</strong> ${patient.age || ''}</td>
          <td style="width: 30%"><strong>DIH:</strong> ${formattedAdmissionDate || ''}</td>
        </tr>
        <tr>
          <td><strong>DIAGNÓSTICO:</strong> ${patient.diagnosis || ''}</td>
          <td><strong>ALERGIAS:</strong> ${patient.allergies || ''}</td>
          <td><strong>ORIGEM:</strong> ${patient.origin || ''}</td>
        </tr>
      </table>
      
      <table class="prescription-table">
        <tr>
          <th class="section-header" style="width: 150px;">ADMISSÃO MÉDICA</th>
          <th class="section-header" colspan="6">MEDICAÇÃO</th>
        </tr>
        <tr>
          <td style="vertical-align: top; border-right: 1px solid #ccc;" rowspan="18">
            <div class="medical-info">
              <div><strong>ADMISSÃO:</strong></div>
              <div style="margin-bottom: 10px;">${medical.admission || ''}</div>
              
              <div><strong>COMORBIDADES:</strong></div>
              <div style="margin-bottom: 10px;">${medical.comorbidities || ''}</div>
              
              <div><strong>MUC:</strong></div>
              <div style="margin-bottom: 10px;">${medical.medicationReason || ''}</div>
              
              <div><strong>EXAME FÍSICO:</strong></div>
              <div style="margin-bottom: 10px;">${medical.physicalExam || ''}</div>
              
              <div><strong>ANÁLISE:</strong></div>
              <div style="margin-bottom: 10px;">${medical.analysis || ''}</div>
              
              <div><strong>CONDUTAS:</strong></div>
              <div>${medical.plans || ''}</div>
            </div>
          </td>
          <th style="text-align: center;">#</th>
          <th style="text-align: center;">MEDICAÇÃO</th>
          <th style="text-align: center;">DOSE</th>
          <th style="text-align: center;">VIA</th>
          <th style="text-align: center;">POSOLOGIA</th>
          <th style="text-align: center;">OBS.</th>
          <th style="text-align: center;">HORÁRIO</th>
        </tr>
        ${prescriptionRows}
        ${emptyRows}
      </table>
      
      <footer style="margin-top: 30px; font-size: 0.8em; color: #777; text-align: center;">
        <p>Documento gerado pelo QuickDoc: Pronto Médico em ${new Date().toLocaleDateString('pt-BR')}</p>
      </footer>
    </body>
    </html>
  `;
};

// Helper function to generate prescription table rows
const generatePrescriptionRows = (prescriptions: PrescriptionItem[]): string => {
  return prescriptions.map((item, index) => `
    <tr>
      <td style="border: 1px solid #ccc; padding: 4px; text-align: center;">${index + 1}</td>
      <td style="border: 1px solid #ccc; padding: 4px;">${item.medication || ''}</td>
      <td style="border: 1px solid #ccc; padding: 4px;">${item.dose || ''}</td>
      <td style="border: 1px solid #ccc; padding: 4px;">${item.route || ''}</td>
      <td style="border: 1px solid #ccc; padding: 4px;">${item.frequency || ''}</td>
      <td style="border: 1px solid #ccc; padding: 4px;">${item.notes || ''}</td>
      <td style="border: 1px solid #ccc; padding: 4px;">${item.time || ''}</td>
    </tr>
  `).join('');
};

// Helper function to generate empty rows to complete table
const generateEmptyRows = (currentRowCount: number): string => {
  const totalRows = 18;
  const emptyRowsCount = totalRows - currentRowCount;
  
  if (emptyRowsCount <= 0) return '';
  
  let emptyRows = '';
  for (let i = 0; i < emptyRowsCount; i++) {
    emptyRows += `
      <tr>
        <td style="border: 1px solid #ccc; padding: 4px; text-align: center;">${currentRowCount + i + 1}</td>
        <td style="border: 1px solid #ccc; padding: 4px;"></td>
        <td style="border: 1px solid #ccc; padding: 4px;"></td>
        <td style="border: 1px solid #ccc; padding: 4px;"></td>
        <td style="border: 1px solid #ccc; padding: 4px;"></td>
        <td style="border: 1px solid #ccc; padding: 4px;"></td>
        <td style="border: 1px solid #ccc; padding: 4px;"></td>
      </tr>
    `;
  }
  return emptyRows;
};
