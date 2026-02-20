export type NumberFormat = "auto" | "decimal" | "thousand";

/**
 * Parse angka dari string spreadsheet.
 *
 * @param str  - string input dari cell spreadsheet
 * @param hint - "auto"     : heuristik otomatis (default)
 *               "thousand" : paksa titik tunggal = pemisah ribuan (kolom ton/bcm/m3)
 *               "decimal"  : paksa titik tunggal = desimal (kolom jam, %, dll)
 *
 * Aturan auto:
 *  - Ada titik DAN koma  → deteksi dari posisi (EU vs US format)
 *  - Koma tunggal        → desimal  ("9,5"       → 9.5)
 *  - Titik lebih dari 1  → semua ribuan ("1.234.567" → 1234567)
 *  - Titik tunggal:
 *      fracPart 3 digit  → ribuan   ("18.000"    → 18000)
 *      fracPart ≠ 3 digit→ desimal  ("9.5"       → 9.5)
 */
export const parseNum = (
  str: string | undefined,
  hint: NumberFormat = "auto"
): number | null => {
  if (!str || str.trim() === "" || str === "-") return null;
  let cleaned = str.trim();

  const hasDot = cleaned.includes(".");
  const hasComma = cleaned.includes(",");

  if (hasDot && hasComma) {
    if (cleaned.indexOf(",") > cleaned.indexOf(".")) {
      // "1.234,56" → EU format: dot=ribuan, comma=desimal
      cleaned = cleaned.replace(/\./g, "").replace(",", ".");
    } else {
      // "1,234.56" → US format: comma=ribuan, dot=desimal
      cleaned = cleaned.replace(/,/g, "");
    }
  } else if (hasComma) {
    // Koma tunggal → desimal ("9,5" → 9.5)
    cleaned = cleaned.replace(",", ".");
  } else if (hasDot) {
    const dotCount = (cleaned.match(/\./g) || []).length;

    if (dotCount > 1) {
      // "1.234.567" → hapus semua titik → 1234567
      cleaned = cleaned.replace(/\./g, "");
    } else {
      const [intPart, fracPart] = cleaned.split(".");

      if (hint === "thousand") {
        // Paksa ribuan: "18.000" → 18000
        cleaned = intPart + fracPart;
      } else if (hint === "decimal") {
        // Paksa desimal: biarkan apa adanya "28.287" → 28.287
        // tidak ada perubahan
      } else {
        // AUTO: fracPart tepat 3 digit → ribuan (konvensi ID)
        if (fracPart && fracPart.length === 3) {
          cleaned = intPart + fracPart; // "18.000" → "18000"
        }
        // fracPart bukan 3 digit → desimal biasa ("9.5" → 9.5)
      }
    }
  }

  const num = Number(cleaned);
  return isNaN(num) ? null : num;
};

// ─── Shorthand helpers ────────────────────────────────────────────────────────

/** Untuk kolom ton / bcm / m3 — titik tunggal selalu ribuan */
export const parseThousand = (str: string | undefined): number | null =>
  parseNum(str, "thousand");

/** Untuk kolom jam operasi, persentase, dll — titik tunggal selalu desimal */
export const parseDecimal = (str: string | undefined): number | null =>
  parseNum(str, "decimal");

// ─── Header / row utils ───────────────────────────────────────────────────────

const ACTIVITY_HEADERS = [
  "Loading Hauling",
  "Loading Haulinggs",
  "Drilling",
  "Perintisan Used",
  "Perintisan New",
  "Bulldozer Used",
  "Bulldozer New",
  "Breaker",
];

export const isHeaderRow = (row: string[]): boolean => {
  if (!row || row.length === 0) return true;
  if (row.every((cell) => !cell || cell.trim() === "")) return true;
  if (row[1] === "No") return true;
  if (row[2] === "Tanggal") return true;
  if (row[3] === "Hari") return true;
  if (row.some((cell) => cell === "Plan" || cell === "Actual" || cell === "RKAP"))
    return true;
  if (row.some((cell) => cell === "[ton]" || cell === "[bcm]" || cell === "[m3]"))
    return true;

  const companyHeaders = [
    "PT Semen Tonasa",
    "PT Semen Padang",
    "Lamongan Shorebase",
    "Site Sale",
  ];
  if (row.some((cell) => companyHeaders.some((company) => cell?.includes(company))))
    return true;

  return row.some((cell) =>
    ACTIVITY_HEADERS.some((activity) => cell?.includes(activity))
  );
};

// ─── Tests ────────────────────────────────────────────────────────────────────

export function testParseNum() {
  const testCases: {
    input: string;
    hint?: NumberFormat;
    expected: number | null;
    desc: string;
  }[] = [
    // ── Kolom [ton] dari spreadsheet → hint "thousand" ──
    { input: "18.000",    hint: "thousand", expected: 18000,   desc: "[ton] plan harian" },
    { input: "22.814",    hint: "thousand", expected: 22814,   desc: "[ton] actual" },
    { input: "24.007",    hint: "thousand", expected: 24007,   desc: "[ton] RKAP" },
    { input: "330.782",   hint: "thousand", expected: 330782,  desc: "[ton] large" },
    { input: "128.075",   hint: "thousand", expected: 128075,  desc: "[ton] medium" },
    { input: "1.234.567", hint: "thousand", expected: 1234567, desc: "[ton] multi-dot" },

    // ── Kolom [ton] auto mode (fracPart 3 digit → ribuan) ──
    { input: "18.000",    expected: 18000,   desc: "auto: 18 ribu ton" },
    { input: "22.814",    expected: 22814,   desc: "auto: actual ton" },
    { input: "24.007",    expected: 24007,   desc: "auto: RKAP ton" },
    { input: "1.234.567", expected: 1234567, desc: "auto: multi-dot ribuan" },

    // ── Kolom jam operasi → hint "decimal" ──
    { input: "28.287", hint: "decimal", expected: 28.287, desc: "[jam] loading hauling plan" },
    { input: "8.075",  hint: "decimal", expected: 8.075,  desc: "[jam] actual" },
    { input: "2.222",  hint: "decimal", expected: 2.222,  desc: "[jam] actual" },

    // ── Koma sebagai desimal (auto) ──
    { input: "9,5",   expected: 9.5,   desc: "koma desimal" },
    { input: "11,11", expected: 11.11, desc: "koma desimal" },
    { input: "22,2",  expected: 22.2,  desc: "koma desimal" },

    // ── Format campuran (auto) ──
    { input: "1.234,56", expected: 1234.56, desc: "EU format" },
    { input: "1,234.56", expected: 1234.56, desc: "US format" },

    // ── Desimal bukan 3 digit (auto) ──
    { input: "9.5",  expected: 9.5,  desc: "auto: desimal 1 digit" },
    { input: "3.14", expected: 3.14, desc: "auto: desimal 2 digit" },

    // ── Edge cases ──
    { input: "",    expected: null, desc: "empty string" },
    { input: "-",   expected: null, desc: "dash" },
    { input: "0",   expected: 0,    desc: "zero" },
    { input: "100", expected: 100,  desc: "plain integer" },
  ];

  console.log("🧪 Testing parseNum:\n");
  let passCount = 0;
  let failCount = 0;

  for (const test of testCases) {
    const result = parseNum(test.input, test.hint ?? "auto");
    const passed = result === test.expected;
    if (passed) {
      passCount++;
      console.log(`✅ "${test.input}" [${test.hint ?? "auto"}] → ${result} | ${test.desc}`);
    } else {
      failCount++;
      console.log(
        `❌ "${test.input}" [${test.hint ?? "auto"}] → ${result} (expected ${test.expected}) | ${test.desc}`
      );
    }
  }

  console.log(`\n📊 Results: ${passCount} passed, ${failCount} failed`);
  return { passCount, failCount };
}

if (require.main === module) {
  testParseNum();
}