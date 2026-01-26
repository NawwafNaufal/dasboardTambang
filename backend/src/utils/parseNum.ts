export const parseNum = (str: string | undefined): number | null => {
    if (!str || str === "" || str === "-") return null;
    const cleaned = str.replace(/\./g, "").replace(/,/g, "");
    const num = Number(cleaned);
    return isNaN(num) ? null : num;
};

const ACTIVITY_HEADERS = [
  "Loading Hauling",
  "Drilling",
  "Perintisan Used",
  "Perintisan New",
  "Bulldozer Used",
  "Bulldozer New",
  "Breaker",
];

export const isHeaderRow = (row: string[]) => {
  // Header kolom utama
  if (row[1] === "No") return true;
  if (row[2] === "Tanggal") return true;
  if (row[3] === "Hari") return true;

  // Sub-header Plan / Actual
  if (row.some(cell => cell === "Plan" || cell === "Actual"))
    return true;

  // Judul perusahaan / laporan
  if (row.some(cell => cell?.includes("PT Semen Tonasa")))
    return true;

  // Header aktivitas
  return row.some(cell =>
    ACTIVITY_HEADERS.some(activity =>
      cell?.includes(activity)
    )
  );
};
  // ← Sub-header kolom