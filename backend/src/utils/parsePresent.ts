export const parsePrecent = (value?: string):number | null => {
    if(!value) return null

    const cleaned = value
            .replace("%","")
            .replace(",",".")
            .trim()
    
        const num = Number(cleaned)
        return Number.isFinite(num) ? num: null
}