function escapeCSV(value) {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
  
  function generateCSV(headers, rows) {
    const escapedHeaders = headers.map(escapeCSV);
    const escapedRows = rows.map(row => row.map(escapeCSV));
    const csvContent = [escapedHeaders, ...escapedRows]
      .map(row => row.join(','))
      .join('\r\n');
    
    return '\uFEFF' + csvContent; 
  }
  
  module.exports = { escapeCSV, generateCSV };