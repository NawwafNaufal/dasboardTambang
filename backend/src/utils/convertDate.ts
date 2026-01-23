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
            Jan: "01", Feb: "02", Mar: "03", Apr: "04",
            Mei: "05", Jun: "06", Jul: "07", Agu: "08",
            Sep: "09", Okt: "10", Nov: "11", Des: "12"
    };

        const month = monthMap[monthPart];
            if (!month) return null;

        return `${year}-${month}-${day}`;
    } catch {
        return null;
    }
}