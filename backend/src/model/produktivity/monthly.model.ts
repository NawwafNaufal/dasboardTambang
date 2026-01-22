import { Schema, model, models, Model } from "mongoose";

/* =====================
   1. Interface Document
===================== */
export interface DailyOperationDoc {
  date: string;
  site: string;
  activities: Map<string, {
    unit: string;
    breakdown: Map<string, number>;
  }>;
}

/* =====================
   2. Schema
===================== */
const DailyOperationSchema = new Schema<DailyOperationDoc>(
  {
    date: { type: String, required: true },
    site: { type: String, required: true },

    activities: {
      type: Map,
      of: new Schema(
        {
          unit: { type: String, required: true },
          breakdown: {
            type: Map,
            of: Number,
          },
        },
        { _id: false }
      ),
    },
  },
  { timestamps: true }
);

/* =====================
   3. Model (CARA 1)
===================== */
export const DailyOperation: Model<DailyOperationDoc> =
  (models.DailyOperation as Model<DailyOperationDoc>) ||
  model<DailyOperationDoc>("DailyOperation", DailyOperationSchema);
