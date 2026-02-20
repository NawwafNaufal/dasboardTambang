export const parseNum = (
  str: string | undefined,
  isLargeNumber: boolean = false
): number | null => {
  if (!str || str.trim() === "" || str === "-") return null;
  let cleaned = str.trim();

  const hasDot = cleaned.includes('.');
  const hasComma = cleaned.includes(',');

  if (hasDot && hasComma) {
    if (cleaned.indexOf(',') > cleaned.indexOf('.')) {
      // "1.234,56" -> EU format: dot=ribuan, comma=desimal
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
      // "1,234.56" -> US format: comma=ribuan, dot=desimal
      cleaned = cleaned.replace(/,/g, '');
    }
  } else if (hasComma) {
    // Koma tunggal, anggap sebagai desimal: "9,5" -> 9.5
    cleaned = cleaned.replace(',', '.');
  } else if (hasDot) {
    const dotCount = (cleaned.match(/\./g) || []).length;
    if (dotCount > 1) {
      // "1.234.567" -> hapus semua titik -> 1234567
      cleaned = cleaned.replace(/\./g, '');
    } else {
      // Titik tunggal: cek digit setelah titik
      const afterDot = cleaned.split('.')[1];
      if (afterDot && afterDot.length === 3 && isLargeNumber) {
        // "18.000", "330.782", "128.075" -> ribuan separator
        cleaned = cleaned.replace('.', '');
      }
      // Jika isLargeNumber=false atau digit != 3: biarkan sebagai desimal
      // "28.28", "9.5" -> tetap desimal
    }
  }

  const num = Number(cleaned);
  return isNaN(num) ? null : num;
};

export function testParseNum() {
  const testCases = [
    // isLargeNumber = false (default) -> desimal
    { input: "28.287", isLarge: false, expected: 28.287, desc: "Loading hauling plan - desimal" },
    { input: "8.075",  isLarge: false, expected: 8.075,  desc: "Loading hauling actual - desimal" },
    { input: "2.222",  isLarge: false, expected: 2.222,  desc: "Loading hauling actual - desimal" },
    { input: "9,5",    isLarge: false, expected: 9.5,    desc: "Equipment hours - koma desimal" },
    { input: "11,11",  isLarge: false, expected: 11.11,  desc: "Equipment hours - koma desimal" },
    { input: "22,2",   isLarge: false, expected: 22.2,   desc: "Equipment hours - koma desimal" },

    // isLargeNumber = true -> titik tunggal 3 digit = ribuan
    { input: "18.000",   isLarge: true, expected: 18000,   desc: "Site Padang - ribuan" },
    { input: "330.782",  isLarge: true, expected: 330782,  desc: "Large number - ribuan" },
    { input: "128.075",  isLarge: true, expected: 128075,  desc: "Large number - ribuan" },
    { input: "1.234.567",isLarge: true, expected: 1234567, desc: "Multiple dots - ribuan" },
    { input: "1.234,56", isLarge: true, expected: 1234.56, desc: "Mixed EU format" },

    // edge cases
    { input: "",    isLarge: false, expected: null, desc: "Empty string" },
    { input: "-",   isLarge: false, expected: null, desc: "Dash" },
    { input: "0",   isLarge: false, expected: 0,    desc: "Zero" },
    { input: "100", isLarge: false, expected: 100,  desc: "Plain number" },
  ];

  console.log('🧪 Testing parseNum:\n');
  let passCount = 0;
  let failCount = 0;

  for (const test of testCases) {
    const result = parseNum(test.input, test.isLarge);
    const passed = result === test.expected;
    if (passed) {
      passCount++;
      console.log(`✅ "${test.input}" (isLarge=${test.isLarge}) → ${result} | ${test.desc}`);
    } else {
      failCount++;
      console.log(`❌ "${test.input}" (isLarge=${test.isLarge}) → ${result} (expected ${test.expected}) | ${test.desc}`);
    }
  }

  console.log(`\n📊 Results: ${passCount} passed, ${failCount} failed`);
  return { passCount, failCount };
}

if (require.main === module) {
  testParseNum();
}

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

export const isHeaderRow = (row: string[]) => {
  if (!row || row.length === 0) return true;
  if (row.every(cell => !cell || cell.trim() === "")) return true;
  if (row[1] === "No") return true;
  if (row[2] === "Tanggal") return true;
  if (row[3] === "Hari") return true;
  if (row.some(cell => cell === "Plan" || cell === "Actual" || cell === "RKAP"))
    return true;
  if (row.some(cell => cell === "[ton]" || cell === "[bcm]" || cell === "[m3]"))
    return true;

  const companyHeaders = [
    "PT Semen Tonasa",
    "PT Semen Padang",
    "Lamongan Shorebase",
    "Site Sale"
  ];
  if (row.some(cell =>
    companyHeaders.some(company => cell?.includes(company))
  )) {
    return true;
  }

  return row.some(cell =>
    ACTIVITY_HEADERS.some(activity =>
      cell?.includes(activity)
    )
  );
};

// Helper: kolom mana saja yang termasuk "large number" (tonnage, volume, bcm, dst)
// Sesuaikan index kolom dengan struktur spreadsheet kamu
export const LARGE_NUMBER_COLUMNS = new Set([
  // contoh index kolom yang berisi tonnage/volume/bcm
  // sesuaikan dengan spreadsheet asli
  4,  // Plan ton
  5,  // Actual ton
  6,  // RKAP
  7,  // Plan bcm
  8,  // Actual bcm
]);

export const isLargeNumberColumn = (colIndex: number): boolean => {
  return LARGE_NUMBER_COLUMNS.has(colIndex);
};