import { Schema, model } from "mongoose";

const DailyOperationSchema = new Schema(
  {
    date: { type: String, required: true }, // "2025-01-01"
    site: { type: String, required: true }, // "JAN" atau "FEB"
    day: { type: String }, // "Rabu", "Kamis"

    // Total summary
    plan: { type: Number, default: null },
    actual: { type: Number, default: null },
    rkap: { type: Number, default: null },

    // Breakdown per activity/contractor
    activities: {
      type: Map,
      of: {
        value: { type: Number, default: null },
        unit: { type: String, default: "ton" }
      }
    }
  },
  { timestamps: true }
);

// Unique index per tanggal dan site
DailyOperationSchema.index(
  { date: 1, site: 1 },
  { unique: true }
);

export const DailyOperation = model("DailyOperation", DailyOperationSchema);