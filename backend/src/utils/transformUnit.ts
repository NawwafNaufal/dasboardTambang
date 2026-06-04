import { parseNum } from "./parseNum";
import { parsePrecent } from "./parsePresent";

const COLUMN_KEYWORDS = [
  'plan', 'fuel', 'perormance', 'performance', 'produksi', 'stb', 'bd',
  'pa', 'ma', 'ua', 'eu', 'produktivity', 'productivity', 'no polisi',
  'physical', 'mechanic', 'utilization', 'effective', 'index',
  '[lbg]', '[mtr]', '[jam]', '[ltr]', '%', 'lbg/jam', 'mtr/jam', 'ltr/mtr'
];

interface UnitPosition {
  name: string;
  colIndex: number;
  fuelOffset: number;
  paOffset: number;
  maOffset: number;
  uaOffset: number;
  euOffset: number;
  lbgOffset: number;
  mtrOffset: number;
  ltrOffset: number;
}

const isUnitHeaderRow = (row: string[]): boolean => {
  if (!row || row.length === 0) return false;
  if (row[1]?.trim() !== '' || row[2]?.trim() !== '' || row[3]?.trim() !== '') return false;

  const filledCells = row
    .slice(4)
    .filter(cell => cell && cell.trim() !== '');

  if (filledCells.length === 0) return false;

  const hasColumnKeyword = filledCells.some(cell =>
    COLUMN_KEYWORDS.some(kw => cell.toLowerCase().includes(kw.toLowerCase()))
  );

  return !hasColumnKeyword;
};

export const transformMultiUnitActivity = (rows: string[][]) => {
  const results: any[] = [];
  let unitPositions: UnitPosition[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    if (isUnitHeaderRow(row)) {
      const rawUnits: { name: string; colIndex: number }[] = [];
      row.forEach((cell, index) => {
        if (index >= 4 && cell && cell.trim() !== '') {
          rawUnits.push({ name: cell.trim(), colIndex: index });
        }
      });

      let lbgJamRow: string[] | null = null;
      let paRow: string[] | null = null;
      for (let j = i + 1; j < Math.min(i + 15, rows.length); j++) {
        if (!lbgJamRow && rows[j].some(c => c?.includes('lbg/jam'))) {
          lbgJamRow = rows[j];
        }
        if (!paRow && rows[j].some(c => c?.toLowerCase().includes('physical'))) {
          paRow = rows[j];
        }
        if (lbgJamRow && paRow) break;
      }

      unitPositions = rawUnits.map((u, idx) => {
        const nextCol = rawUnits[idx + 1]?.colIndex ?? 999;

        // unit pertama: fuel di colIndex+1 (col 5 untuk HCR-07 base=4)
        // unit lainnya: fuel tepat di colIndex sendiri
        // karena di data row, nilai fuel ada di kolom yang sama dengan colIndex unit tsb
        const fuelOffset = idx === 0 ? 1 : 0;

        let paOffset = 7;
        if (paRow) {
          for (let k = u.colIndex + 1; k < nextCol; k++) {
            if (paRow[k]?.toLowerCase().includes('physical')) {
              paOffset = k - u.colIndex;
              break;
            }
          }
        }

        let lbgOffset = paOffset + 4;
        let mtrOffset = paOffset + 5;
        let ltrOffset = paOffset + 6;
        if (lbgJamRow) {
          for (let k = u.colIndex + 1; k < nextCol + 5; k++) {
            if (lbgJamRow[k]?.includes('lbg/jam')) lbgOffset = k - u.colIndex;
            if (lbgJamRow[k]?.includes('mtr/jam')) mtrOffset = k - u.colIndex;
            if (lbgJamRow[k]?.includes('ltr/mtr')) ltrOffset = k - u.colIndex;
          }
        }

        return {
          name: u.name,
          colIndex: u.colIndex,
          fuelOffset,
          paOffset,
          maOffset: paOffset + 1,
          uaOffset: paOffset + 2,
          euOffset: paOffset + 3,
          lbgOffset,
          mtrOffset,
          ltrOffset,
        };
      });

      continue;
    }

    const date = row[2];
    const day  = row[3];

    if (!date || date.trim() === '' || date === 'Tanggal') continue;
    if (!row[1] || row[1].trim() === '' || isNaN(Number(row[1]))) continue;
    if (unitPositions.length === 0) continue;

    const plan = parseNum(row[4]) ?? 0;
    const units: any[] = [];

    for (const block of unitPositions) {
      const base = block.colIndex;

      const fuelRaw = row[base + block.fuelOffset];
      const paRaw = row[base + block.paOffset];
      const euRaw = row[base + block.euOffset];
      const lbgRaw = row[base + block.lbgOffset];

      const hasFuel = fuelRaw !== undefined && fuelRaw.trim() !== "" && fuelRaw.trim() !== "-";
      const hasPa = paRaw !== undefined && paRaw.trim() !== "" && paRaw.trim() !== "-";
      const hasEu = euRaw !== undefined && euRaw.trim() !== "" && euRaw.trim() !== "-";
      const hasLbg = lbgRaw !== undefined && lbgRaw.trim() !== "" && lbgRaw.trim() !== "-";

      if (!hasFuel && !hasPa && !hasEu && !hasLbg) continue;

      const fuel   = parseNum(fuelRaw) ?? 0;
      const pa     = parsePrecent(paRaw);
      const ma     = parsePrecent(row[base + block.maOffset]);
      const ua     = parsePrecent(row[base + block.uaOffset]);
      const eu     = parsePrecent(euRaw);
      const lbgJam = parseNum(lbgRaw) ?? 0;
      const mtrJam = parseNum(row[base + block.mtrOffset]) ?? 0;
      const ltrMtr = parseNum(row[base + block.ltrOffset]) ?? 0;

      units.push({
        unit: block.name,
        plan,
        fuel,
        pa,
        ma,
        ua,
        eu,
        produktivityIndex: { lbgJam, mtrJam, ltrMtr },
      });
    }

    if (units.length === 0) continue;
    results.push({ date, day, units });
  }

  return results;
};