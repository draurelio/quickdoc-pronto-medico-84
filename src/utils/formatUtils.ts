
// Utility functions for formatting data in documents

// Function to format date from YYYY-MM-DD to DD/MM/YYYY
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};
