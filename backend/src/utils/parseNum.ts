export const parseNum = (str: string | undefined): number | null => {
    if (!str || str === "" || str === "-") return null;
    const cleaned = str.replace(/\./g, "").replace(/,/g, "");
    const num = Number(cleaned);
    return isNaN(num) ? null : num;
};

// ✅ PERBAIKAN: Tambah check untuk header berulang
export const isHeaderRow = (row: string[]) =>
    row[1] === "No" || 
    row[2] === "Tanggal" || 
    row[3] === "Hari" ||
    row.some(cell => cell && cell.includes("PT Semen Tonasa")) || // ← Header bulan baru
    row.some(cell => cell && cell.includes("Loading Hauling")) || // ← Activity header
    row.some(cell => cell && cell.includes("Drilling")) ||        // ← Activity header lain
    row.some(cell => cell === "Plan" || cell === "Actual");       // ← Sub-header kolom