import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function exportToExcel(data, sheetName='Sheet1', fileName='export') {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, fileName + '.xlsx');
}

export function exportToPDF(columns, data, fileName='export') {
  const doc = new jsPDF();
  const head = [columns];
  const body = data.map(row => columns.map(c => row[c] ?? ''));
  doc.autoTable({ head, body, styles:{fontSize:8} });
  doc.save(fileName + '.pdf');
}
