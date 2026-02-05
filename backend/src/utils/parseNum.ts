export const parseNum = (str: string | undefined): number | null => {
  if (!str || str === "" || str === "-") return null;
  const cleaned = str.replace(/\./g, "").replace(/,/g, "");
  const num = Number(cleaned);
  return isNaN(num) ? null : num;
};

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