
import type { DocumentData } from "./documentHtmlGenerator";
import { generateMedicalRecordHtml } from "./documentHtmlGenerator";

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
