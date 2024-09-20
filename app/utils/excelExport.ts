import * as XLSX from 'xlsx';

export function exportToExcel(data: any[], fileName: string) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();

  // Add some styling
  const headerStyle = {
    font: { bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "4F81BD" } }
  };

  const evenRowStyle = {
    fill: { fgColor: { rgb: "E9EDF1" } }
  };

  const oddRowStyle = {
    fill: { fgColor: { rgb: "D3DFEE" } }
  };

  // Apply styles to the header row
  const range = XLSX.utils.decode_range(ws['!ref']!);
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const address = XLSX.utils.encode_col(C) + "1";
    if (!ws[address]) continue;
    ws[address].s = headerStyle;
  }

  // Apply alternating row styles
  for (let R = range.s.r + 1; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_cell({r: R, c: C});
      if (!ws[address]) continue;
      ws[address].s = R % 2 === 0 ? evenRowStyle : oddRowStyle;
    }
  }

  // Auto-size columns
  const colWidths = data.reduce((acc, row) => {
    Object.keys(row).forEach((key, i) => {
      const cellValue = row[key] ? row[key].toString() : '';
      acc[i] = Math.max(acc[i] || 0, cellValue.length);
    });
    return acc;
  }, {});

  ws['!cols'] = Object.keys(colWidths).map(i => ({ wch: colWidths[i] }));

  XLSX.utils.book_append_sheet(wb, ws, "Optimal Conversion Path");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}