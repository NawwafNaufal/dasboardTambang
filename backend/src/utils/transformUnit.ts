export const transformMultiUnitActivity = (row: string[]) => {
  const date = row[2];
  const day = row[3];

  if (!date || date === 'Tanggal') return null;
  if (!row[1] || isNaN(Number(row[1]))) return null;

  const plan = Number(row[4]) || 0; // ✅ PLAN Customer shared semua unit

  const unitBlocks = [
    { name: "HCR-07",    base: 5  }, // ← base mulai dari Fuel, bukan PLAN
    { name: "EPIROC-01", base: 19 },
    { name: "EPIROC-02", base: 33 },
    { name: "PCR-01",    base: 47 },
  ];

  const units: any[] = [];

  for (const block of unitBlocks) {
    const fuel = Number(row[block.base])      || 0;
    const pa   = Number(row[block.base + 6])  || 0;
    const ma   = Number(row[block.base + 7])  || 0;
    const ua   = Number(row[block.base + 8])  || 0;
    const eu   = Number(row[block.base + 9])  || 0;

    if (pa === 0 && ma === 0 && ua === 0 && eu === 0) continue;

    units.push({
      unit: block.name,
      plan, // ✅ pakai plan yang sama untuk semua unit
      fuel,
      pa,
      ma,
      ua,
      eu,
    });
  }

  if (units.length === 0) return null;

  return { date, day, units };
};