import * as XLSX from 'xlsx';

/**
 * Loads medication names from a specified column in an XLS file sheet.
 * 
 * @param filePath The path to the XLS file (e.g., '/cmed_lista.xls').
 * @param sheetName The name of the sheet to read from (e.g., 'Sheet1').
 * @param columnName The name of the column containing medication names (e.g., 'NOME_MEDICAMENTO').
 * @returns A promise that resolves to an array of unique medication name strings.
 */
export const loadMedicationsFromXLS = async (
  filePath: string,
  sheetName: string,
  columnName: string
): Promise<string[]> => {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch XLS file: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });

    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) {
      throw new Error(`Sheet '${sheetName}' not found in the workbook.`);
    }

    // Convert sheet to JSON. Header option '1' uses the first row as headers.
    // defval: '' ensures that empty cells are converted to empty strings.
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

    if (jsonData.length === 0) {
      return []; // Empty sheet
    }

    const headerRow: string[] = jsonData[0].map((cell: any) => String(cell).trim());
    const columnIndex = headerRow.indexOf(columnName);

    if (columnIndex === -1) {
      throw new Error(`Column '${columnName}' not found in sheet '${sheetName}'. Headers found: ${headerRow.join(', ')}`);
    }

    const medications = new Set<string>();
    // Start from row 1 (index 1) to skip the header row
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (row && row[columnIndex]) {
        const medicationName = String(row[columnIndex]).trim();
        if (medicationName) { // Ensure non-empty medication name
          medications.add(medicationName);
        }
      }
    }
    
    console.log(`Loaded ${medications.size} unique medications from ${filePath}`);
    return Array.from(medications);

  } catch (error) {
    console.error("Error loading medications from XLS:", error);
    return []; // Return empty array on error
  }
};
