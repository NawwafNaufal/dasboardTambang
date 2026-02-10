export const parseNum = (str: string | undefined): number | null => {
  if (!str || str.trim() === "" || str === "-") return null;

  let cleaned = str.trim();

  // Deteksi format ribuan/desimal
  // Kasus: "1,234.56" -> format US
  // Kasus: "1.234,56" -> format EU
  const hasDot = cleaned.includes('.');
  const hasComma = cleaned.includes(',');

  if (hasDot && hasComma) {
    // Tentukan mana desimal, mana ribuan
    if (cleaned.indexOf(',') > cleaned.indexOf('.')) {
      // Misal "1.234,56" -> EU format
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
      // Misal "1,234.56" -> US format
      cleaned = cleaned.replace(/,/g, '');
    }
  } else if (hasComma) {
    // Koma tunggal, anggap sebagai desimal
    cleaned = cleaned.replace(',', '.');
  } else if (hasDot) {
    // Titik tunggal, anggap desimal
    // Titik lebih dari satu? hapus titik ribuan
    const dotCount = (cleaned.match(/\./g) || []).length;
    if (dotCount > 1) {
      cleaned = cleaned.replace(/\./g, '');
    }
  }

  const num = Number(cleaned);
  return isNaN(num) ? null : num;
};


export function testParseNum() {
  const testCases = [
    { input: "28.287", expected: 28.287, desc: "Loading hauling plan - small number" },
    { input: "8.075", expected: 8.075, desc: "Loading hauling actual - small number" },
    { input: "2.222", expected: 2.222, desc: "Loading hauling actual - small number" },
    
    { input: "9,5", expected: 9.5, desc: "Equipment hours dengan koma" },
    { input: "11,11", expected: 11.11, desc: "Equipment hours dengan koma" },
    { input: "22,2", expected: 22.2, desc: "Equipment hours dengan koma" },
    
    { input: "330.782", expected: 330782, desc: "Large number - thousand separator" },
    { input: "128.075", expected: 128075, desc: "Large number - thousand separator" },
    { input: "1.234.567", expected: 1234567, desc: "Multiple dots - thousand separators" },
    
    { input: "1.234,56", expected: 1234.56, desc: "Mixed: dot=thousand, comma=decimal" },
    
    { input: "", expected: null, desc: "Empty string" },
    { input: "-", expected: null, desc: "Dash" },
    { input: "0", expected: 0, desc: "Zero" },
    { input: "100", expected: 100, desc: "Plain number" },
  ];

  console.log('🧪 Testing parseNum:\n');

  let passCount = 0;
  let failCount = 0;

  for (const test of testCases) {
    const result = parseNum(test.input);
    const passed = result === test.expected;

    if (passed) {
      passCount++;
      console.log(`✅ "${test.input}" → ${result} | ${test.desc}`);
    } else {
      failCount++;
      console.log(`❌ "${test.input}" → ${result} (expected ${test.expected}) | ${test.desc}`);
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
    "UTSG"
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