export const convertDateFormat = (dateStr: string): string | null => {
    try {
        const parts = dateStr.split("-");
    
            if (parts.length !== 3) return null;

        const dayPart = parts[0];
        const monthPart = parts[1];
        const yearPart = parts[2];

            if (!dayPart || !monthPart || !yearPart) return null;

        const day = dayPart.padStart(2, "0");
        const year = `20${yearPart}`;

        const monthMap: Record<string, string> = {
            Januari: "01", Februari: "02", Maret: "03", April: "04",
            Mei: "05", Juni: "06", Juli: "07", Agustus: "08",
            September: "09", Oktober: "10", November: "11", Desember: "12"
        };

        const month = monthMap[monthPart];
            if (!month) return null;

        return `${year}-${month}-${day}`;
    } catch {
        return null;
    }
}