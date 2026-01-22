export interface DailyOperationData {
            date: string;
            site: string;
            day?: string;
            plan: number | null;
            actual: number | null;
            rkap: number | null;
            activities: Record<string, {
                unit: string;
                value?: number | null;
                breakdown?: Record<string, number | null>;
    }>
}