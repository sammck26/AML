const { expect } = require('chai');
const { escapeCSV, generateCSV } = require('./exportcsv.js');

describe('exportCsv utility', () => {
  describe('escapeCSV', () => {
    it('should return the same string if no special characters', () => {
      expect(escapeCSV('HelloWorld')).to.equal('HelloWorld');
    });

    it('should wrap value in quotes if it contains a comma', () => {
      expect(escapeCSV('Hello,World')).to.equal('"Hello,World"');
    });

    it('should escape quotes', () => {
        expect(escapeCSV('He said "Hello"')).to.equal('"He said ""Hello"""');
    });

    it('should handle newlines', () => {
      expect(escapeCSV('Hello\nWorld')).to.equal('"Hello\nWorld"');
    });
  });

  describe('generateCSV', () => {
    it('should generate a CSV string from headers and rows', () => {
      const headers = ['Account Name', 'Email', 'Total Amount'];
      const rows = [
        ['John Doe', 'john@example.com', '100'],
        ['Jane Doe', 'jane@example.com', '200']
      ];

      const csv = generateCSV(headers, rows);
      const expected =
        'Account Name,Email,Total Amount\r\nJohn Doe,john@example.com,100\r\nJane Doe,jane@example.com,200';
      expect(csv).to.include(expected); // CSV might have a BOM, so we just check that it includes the expected text
    });
  });
});