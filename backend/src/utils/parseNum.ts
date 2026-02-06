/**
 * Parse Indonesian number format to JavaScript number
 * 
 * SIMPLE RULE:
 * - Koma (,) = SELALU decimal separator
 * - Titik (.) = Tergantung konteks:
 *   - Jika ada koma juga → titik = thousand separator
 *   - Jika sendirian dan angka di depan kecil (<100) → titik = decimal
 *   - Jika sendirian dan angka di depan besar (≥100) → titik = thousand separator
 * 
 * Examples:
 * - "9,5" → 9.5 (koma = decimal)
 * - "8.075" → 8.075 (angka depan kecil = decimal)
 * - "28.287" → 28.287 (angka depan kecil = decimal)
 * - "128.287" → 128287 (angka depan besar = thousand)
 * - "1.234,56" → 1234.56 (titik = thousand, koma = decimal)
 * - "27.174" → 27.174 (angka depan kecil = decimal)
 * - "330.782" → 330782 (angka depan besar = thousand)
 */

export const parseNum = (str: string | undefined): number | null => {
  if (!str || str === "" || str === "-") return null;

  const trimmed = str.trim();
  
  // ✅ Aturan 1: Ada KOMA → koma = decimal, titik = thousand
  if (trimmed.includes(',')) {
    const cleaned = trimmed
      .replace(/\./g, '')    // Hapus semua titik (thousand)
      .replace(',', '.');     // Ganti koma jadi titik (decimal)
    
    const num = Number(cleaned);
    return isNaN(num) ? null : num;
  }
  
  // ✅ Aturan 2: Hanya ada TITIK → cek angka di depan titik
  if (trimmed.includes('.')) {
    const parts = trimmed.split('.');
    
    // Multiple dots → thousand separators: "1.234.567"
    if (parts.length > 2) {
      const cleaned = trimmed.replace(/\./g, '');
      const num = Number(cleaned);
      return isNaN(num) ? null : num;
    }
    
    // Single dot → cek angka di depan
    const beforeDot = parseInt(parts[0]);
    
    // Angka kecil (<100) → titik = decimal
    // "8.075" → 8.075, "28.287" → 28.287, "99.999" → 99.999
    if (beforeDot < 100) {
      const num = Number(trimmed);
      return isNaN(num) ? null : num;
    }
    
    // Angka besar (≥100) → titik = thousand separator
    // "330.782" → 330782, "128.075" → 128075
    else {
      const cleaned = trimmed.replace(/\./g, '');
      const num = Number(cleaned);
      return isNaN(num) ? null : num;
    }
  }
  
  // ✅ Aturan 3: Tidak ada separator → langsung convert
  const num = Number(trimmed);
  return isNaN(num) ? null : num;
};

// ============================================
// TEST CASES
// ============================================

export function testParseNum() {
  const testCases = [
    // Dari log Anda
    { input: "28.287", expected: 28.287, desc: "Loading hauling plan - small number" },
    { input: "8.075", expected: 8.075, desc: "Loading hauling actual - small number" },
    { input: "2.222", expected: 2.222, desc: "Loading hauling actual - small number" },
    
    // Equipment hours
    { input: "9,5", expected: 9.5, desc: "Equipment hours dengan koma" },
    { input: "11,11", expected: 11.11, desc: "Equipment hours dengan koma" },
    { input: "22,2", expected: 22.2, desc: "Equipment hours dengan koma" },
    
    // Large numbers (thousand separator)
    { input: "330.782", expected: 330782, desc: "Large number - thousand separator" },
    { input: "128.075", expected: 128075, desc: "Large number - thousand separator" },
    { input: "1.234.567", expected: 1234567, desc: "Multiple dots - thousand separators" },
    
    // Mixed format
    { input: "1.234,56", expected: 1234.56, desc: "Mixed: dot=thousand, comma=decimal" },
    
    // Edge cases
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

// Run test if executed directly
if (require.main === module) {
  testParseNum();
}

const ACTIVITY_HEADERS = [
  "Loading Hauling",
  "Loading Haulinggs",  // Typo di PT Semen Padang
  "Drilling",
  "Perintisan Used",
  "Perintisan New",
  "Bulldozer Used",
  "Bulldozer New",
  "Breaker",
];

export const isHeaderRow = (row: string[]) => {
  // Baris kosong atau semua cell kosong
  if (!row || row.length === 0) return true;
  if (row.every(cell => !cell || cell.trim() === "")) return true;
  
  // Header kolom utama
  if (row[1] === "No") return true;
  if (row[2] === "Tanggal") return true;
  if (row[3] === "Hari") return true;
  
  // Sub-header Plan / Actual / RKAP
  if (row.some(cell => cell === "Plan" || cell === "Actual" || cell === "RKAP")) 
    return true;
  
  // Sub-header kolom unit [ton], [bcm], dll
  if (row.some(cell => cell === "[ton]" || cell === "[bcm]" || cell === "[m3]")) 
    return true;
  
  // Judul perusahaan / laporan (SEMUA SITE)
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
  
  // Header aktivitas
  return row.some(cell =>
    ACTIVITY_HEADERS.some(activity =>
      cell?.includes(activity)
    )
  );
};