
import { PatientData } from "../components/PatientHeader";
import { PrescriptionItem } from "../components/PrescriptionTable";
import { MedicalFormData } from "../components/MedicalForm";

interface DocumentData {
  patient: PatientData;
  prescriptions: PrescriptionItem[];
  medical: MedicalFormData;
}

// Function to format date from YYYY-MM-DD to DD/MM/YYYY
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

// Generate HTML for the medical record document
export const generateMedicalRecordHtml = (data: DocumentData): string => {
  const { patient, prescriptions, medical } = data;
  
  // Format dates
  const formattedAdmissionDate = formatDate(patient.admissionDate);
  const formattedCurrentDate = formatDate(patient.currentDate);

  // Create prescription table rows
  const prescriptionRows = prescriptions.map(item => `
    <tr>
      <td style="border: 1px solid #ccc; padding: 8px;">${item.medication}</td>
      <td style="border: 1px solid #ccc; padding: 8px;">${item.dose}</td>
      <td style="border: 1px solid #ccc; padding: 8px;">${item.route}</td>
      <td style="border: 1px solid #ccc; padding: 8px;">${item.frequency}</td>
      <td style="border: 1px solid #ccc; padding: 8px;">${item.notes}</td>
      <td style="border: 1px solid #ccc; padding: 8px;">${item.time}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Prontuário Médico - ${patient.name}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 20px;
        }
        h1, h2, h3, h4 {
          color: #0A6ED1;
          margin-top: 20px;
        }
        h1 {
          text-align: center;
          border-bottom: 2px solid #0A6ED1;
          padding-bottom: 10px;
        }
        .header-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .header-item {
          margin-bottom: 10px;
        }
        .section {
          margin: 20px 0;
          border: 1px solid #ccc;
          padding: 15px;
          border-radius: 5px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
        }
        th, td {
          border: 1px solid #ccc;
          padding: 8px;
        }
        th {
          background-color: #f0f7ff;
          color: #0A6ED1;
          font-weight: bold;
        }
        .field-title {
          font-weight: bold;
          color: #0A6ED1;
          margin-top: 10px;
          margin-bottom: 5px;
        }
        .field-content {
          margin-left: 15px;
          white-space: pre-wrap;
        }
        @media print {
          body {
            margin: 0;
            padding: 20px;
          }
          button {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <h1>Prontuário Médico</h1>
      
      <div class="section">
        <h2>Dados do Paciente</h2>
        <div class="header-grid">
          <div class="header-item">
            <span class="field-title">Nome:</span>
            <div class="field-content">${patient.name || 'Não informado'}</div>
          </div>
          <div class="header-item">
            <span class="field-title">Idade:</span>
            <div class="field-content">${patient.age || 'Não informada'}</div>
          </div>
          <div class="header-item">
            <span class="field-title">Data de Internação (DIH):</span>
            <div class="field-content">${formattedAdmissionDate || 'Não informada'}</div>
          </div>
          <div class="header-item">
            <span class="field-title">Data Atual:</span>
            <div class="field-content">${formattedCurrentDate || 'Não informada'}</div>
          </div>
          <div class="header-item">
            <span class="field-title">Origem:</span>
            <div class="field-content">${patient.origin || 'Não informada'}</div>
          </div>
        </div>
        <div class="header-item">
          <span class="field-title">Diagnóstico:</span>
          <div class="field-content">${patient.diagnosis || 'Não informado'}</div>
        </div>
        <div class="header-item">
          <span class="field-title">Alergias:</span>
          <div class="field-content">${patient.allergies || 'Não há alergias informadas'}</div>
        </div>
      </div>
      
      <div class="section">
        <h2>Prescrição Médica</h2>
        <table>
          <thead>
            <tr>
              <th>Medicação</th>
              <th>Dose</th>
              <th>Via</th>
              <th>Posologia</th>
              <th>Observações</th>
              <th>Horário</th>
            </tr>
          </thead>
          <tbody>
            ${prescriptionRows || '<tr><td colspan="6" style="text-align: center;">Nenhuma medicação prescrita</td></tr>'}
          </tbody>
        </table>
      </div>
      
      <div class="section">
        <h2>Admissão Médica e Evolução</h2>
        
        <div class="field-title">Admissão:</div>
        <div class="field-content">${medical.admission || 'Não informado'}</div>
        
        <div class="field-title">Comorbidades:</div>
        <div class="field-content">${medical.comorbidities || 'Não informado'}</div>
        
        <div class="field-title">MUC (Motivo do uso da medicação):</div>
        <div class="field-content">${medical.medicationReason || 'Não informado'}</div>
        
        <div class="field-title">Exame Físico:</div>
        <div class="field-content">${medical.physicalExam || 'Não informado'}</div>
        
        <div class="field-title">Análise:</div>
        <div class="field-content">${medical.analysis || 'Não informado'}</div>
        
        <div class="field-title">Condutas:</div>
        <div class="field-content">${medical.plans || 'Não informado'}</div>
      </div>
      
      <footer style="margin-top: 30px; text-align: center; font-size: 0.9em; color: #777;">
        <p>Documento gerado pelo QuickDoc: Pronto Médico em ${new Date().toLocaleDateString('pt-BR')}</p>
      </footer>
    </body>
    </html>
  `;
};

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

// In real implementation, can use libraries like jsPDF or html2pdf for proper PDF conversion
