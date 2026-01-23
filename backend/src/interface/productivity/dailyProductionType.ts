export interface DailyOperationData {
    date: string;
    site: string;
    day?: string;
    activities: Record<string, {
        unit: string;
        plan?: number | null
        actual?: number | null
        rkap?: number | null
        reason?: string | null
        breakdown?: Record<string, number | null>;
    }>;
}

export interface DailyOperationDoc extends Document {
    date: string;
    site: string;
    day?: string;
    activities: Map<string, {
        unit: string;
        plan?: number | null;
        actual?: number | null;
        rkap?: number | null;
        reason? : string | null
        breakdown?: Map<string, number | null>;
    }>;
    createdAt?: Date;
    updatedAt?: Date;
}