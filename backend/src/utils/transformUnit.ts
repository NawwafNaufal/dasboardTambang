export const transformMultiUnitActivity = (rows: string[][]) => {
  // cari header row yang berisi nama-nama unit
  const unitHeaderRow = rows.find(row =>
    row[4] && row[4] !== '' && row[1] === '' && row[2] === '' && row[3] === ''
  );

  if (!unitHeaderRow) return [];

  // ambil nama unit dan posisi kolomnya
  const unitPositions: { name: string; base: number }[] = [];
  unitHeaderRow.forEach((cell, index) => {
    if (index >= 4 && cell && cell !== '') {
      unitPositions.push({ name: cell, base: index + 1 });
    }
  });

  const results: any[] = [];

  for (const row of rows) {
    const date = row[2];
    const day  = row[3];

    if (!date || date === 'Tanggal') continue;
    if (!row[1] || isNaN(Number(row[1]))) continue;

    const plan  = Number(row[4]) || 0;
    const units: any[] = [];

    for (const block of unitPositions) {
  
      const fuel = Number(row[block.base])     || 0;
      const pa   = Number(row[block.base + 6]) || 0;
      const ma   = Number(row[block.base + 7]) || 0;
      const ua   = Number(row[block.base + 8]) || 0;
      const eu   = Number(row[block.base + 9]) || 0;

      if (pa === 0 && ma === 0 && ua === 0 && eu === 0) continue;

      units.push({ unit: block.name, plan, fuel, pa, ma, ua, eu });
    }

    if (units.length === 0) continue;
    results.push({ date, day, units });
  }

  return results;
};