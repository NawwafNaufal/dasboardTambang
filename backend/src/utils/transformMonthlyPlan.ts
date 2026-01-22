import { DailyOperationData } from "../interface/productivity/dailyProductionType";
import { convertDateFormat } from "./convertDate";

export const transformDailyOperation = (rows: string[][], site: string = "JAN") => {
  console.log("[TRANSFORM] raw rows:", rows.length);

  const result: DailyOperationData[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    console.log(`[TRANSFORM] row ${i}:`, row);

    // Skip empty rows
    if (!row || row.length === 0) {
      console.log("[TRANSFORM] skip empty row");
      continue;
    }

    // Skip header
    if (
      row[1] === "No" ||
      row[2] === "Tanggal" ||
      row[3] === "Hari"
    ) {
      console.log("[TRANSFORM] skip header row");
      continue;
    }

    // Skip jika kurang dari 11 kolom
    if (row.length < 11) {
      console.log("[TRANSFORM] skip incomplete row, length:", row.length);
      continue;
    }

    // ✅ Parse columns - ADA KOLOM KOSONG DI INDEX 0!
    // Array: ['', 'No', 'Tanggal', 'Hari', 'Plan', 'Actual', 'RKAP', 'Toppa', 'Batara', 'UTSG', 'Annur']
    // Index:  0    1       2         3       4        5         6        7        8        9       10
    const tanggal = row[2]?.trim();        // ✅ Index 2
    const hari = row[3]?.trim();           // ✅ Index 3
    const planStr = row[4]?.trim();        // ✅ Index 4
    const actualStr = row[5]?.trim();      // ✅ Index 5
    const rkapStr = row[6]?.trim();        // ✅ Index 6
    const toppabiringStr = row[7]?.trim(); // ✅ Index 7
    const bataraStr = row[8]?.trim();      // ✅ Index 8
    const utsgStr = row[9]?.trim();        // ✅ Index 9
    const annurStr = row[10]?.trim();      // ✅ Index 10

    // Validate date
    if (!tanggal) {
      console.log("[TRANSFORM] skip - no date");
      continue;
    }

    // Convert date: "24-Jan-25" -> "2025-01-24"
    const dateFormatted = convertDateFormat(tanggal);
    if (!dateFormatted) {
      console.log("[TRANSFORM] skip - invalid date:", tanggal);
      continue;
    }

    // Parse number helper (handle titik sebagai thousand separator)
    const parseNum = (str: string | undefined): number | null => {
      if (!str || str === "" || str === "-") return null;
      // Remove titik (.) sebagai thousand separator
      const cleaned = str.replace(/\./g, "");
      const num = Number(cleaned);
      return isNaN(num) ? null : num;
    };

    // Build activities dynamically
    const activities: Record<string, any> = {};

    // Activity: loading_hauling dengan breakdown per kontraktor
    const breakdown: Record<string, number | null> = {};
    
    const toppabiring = parseNum(toppabiringStr);
    const batara = parseNum(bataraStr);
    const utsg = parseNum(utsgStr);
    const annur = parseNum(annurStr);

    if (toppabiring !== null) breakdown["toppabiring"] = toppabiring;
    if (batara !== null) breakdown["batara"] = batara;
    if (utsg !== null) breakdown["utsg"] = utsg;
    if (annur !== null) breakdown["annur"] = annur;

    // Hitung total loading_hauling
    const totalLoadingHauling = [toppabiring, batara, utsg, annur]
      .filter(v => v !== null)
      .reduce((sum, v) => sum + (v || 0), 0);

    activities["loading_hauling"] = {
      unit: "ton",
      value: totalLoadingHauling > 0 ? totalLoadingHauling : null,
      breakdown: Object.keys(breakdown).length > 0 ? breakdown : undefined
    };

    const dailyData: DailyOperationData = {
      date: dateFormatted,
      site: site,
      day: hari,
      plan: parseNum(planStr),
      actual: parseNum(actualStr),
      rkap: parseNum(rkapStr),
      activities: activities
    };

    result.push(dailyData);
    console.log(`[TRANSFORM] ✅ Added: ${dateFormatted} (${hari})`);
  }

  console.log("[TRANSFORM] result count:", result.length);
  console.log("[TRANSFORM] result data:", JSON.stringify(result, null, 2));
  return result;
};

