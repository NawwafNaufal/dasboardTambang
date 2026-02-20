export const parseNum = (str: string | undefined): number | null => {
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
    // Koma tunggal → desimal ("9,5" → 9.5, "8,8" → 8.8)
    cleaned = cleaned.replace(",", ".");
  } else if (hasDot) {
    const dotCount = (cleaned.match(/\./g) || []).length;

    if (dotCount > 1) {
      // "1.234.567" → semua titik = ribuan → 1234567
      cleaned = cleaned.replace(/\./g, "");
    } else {
      const [intPart, fracPart] = cleaned.split(".");

      if (fracPart && fracPart.length === 3) {
        if (/^0+$/.test(fracPart)) {
          // fracPart semua nol → ribuan
          // "18.000" → 18000
          // "5.000"  → 5000
          cleaned = intPart + fracPart;
        }
        // fracPart bukan semua nol → desimal, biarkan
        // "22.814" → 22.814
        // "24.007" → 24.007
      }
      // fracPart bukan 3 digit → desimal biasa
      // "8.8"  → 8.8
      // "3.14" → 3.14
    }
  }

  const num = Number(cleaned);
  return isNaN(num) ? null : num;
};

export function testParseNum() {
  const testCases = [
    // fracPart 3 digit semua nol → ribuan
    { input: "18.000",    expected: 18000,   desc: "ribuan - semua nol" },
    { input: "5.000",     expected: 5000,    desc: "ribuan - semua nol" },

    // fracPart 3 digit bukan semua nol → desimal
    { input: "22.814",    expected: 22.814,  desc: "desimal - actual ton" },
    { input: "24.007",    expected: 24.007,  desc: "desimal - RKAP" },
    { input: "23.543",    expected: 23.543,  desc: "desimal - RKAP" },
    { input: "330.782",   expected: 330.782, desc: "desimal - large" },
    { input: "128.075",   expected: 128.075, desc: "desimal - medium" },

    // Multi-dot → ribuan
    { input: "1.234.567", expected: 1234567, desc: "ribuan - multi-dot" },

    // Desimal bukan 3 digit
    { input: "8.8",       expected: 8.8,     desc: "desimal - 1 digit" },
    { input: "3.14",      expected: 3.14,    desc: "desimal - 2 digit" },
    { input: "28.5",      expected: 28.5,    desc: "desimal - 1 digit" },

    // Koma sebagai desimal
    { input: "9,5",       expected: 9.5,     desc: "koma desimal" },
    { input: "8,8",       expected: 8.8,     desc: "koma desimal" },
    { input: "11,11",     expected: 11.11,   desc: "koma desimal" },
    { input: "22,2",      expected: 22.2,    desc: "koma desimal" },

    // Format campuran
    { input: "1.234,56",  expected: 1234.56, desc: "EU format" },
    { input: "1,234.56",  expected: 1234.56, desc: "US format" },

    // Edge cases
    { input: "",          expected: null,    desc: "empty string" },
    { input: "-",         expected: null,    desc: "dash" },
    { input: "0",         expected: 0,       desc: "zero" },
    { input: "100",       expected: 100,     desc: "plain integer" },
  ];

  console.log("Testing parseNum:\n");
  let passCount = 0;
  let failCount = 0;

  for (const test of testCases) {
    const result = parseNum(test.input);
    const passed = result === test.expected;
    if (passed) {
      passCount++;
      console.log(`PASS "${test.input}" -> ${result} | ${test.desc}`);
    } else {
      failCount++;
      console.log(`FAIL "${test.input}" -> ${result} (expected ${test.expected}) | ${test.desc}`);
    }
  }

  console.log(`\nResults: ${passCount} passed, ${failCount} failed`);
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