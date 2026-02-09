import { Schema, model, models, Model, Document } from "mongoose";
import { DailyOperationDoc } from "../../interface/productivity/dailyProductionType";

const ActivitySchema = new Schema(
  {
    unit: { type: String, required: true },
    plan: { type: Number, default: null },
    actual: { type: Number, default: null },
    rkap: { type: Number, default: null },
    volume : {type : Number, default: null},
    ach: {type: Number, min: 0, max: 100, default:null},
    reason: {type: String, default: null},
    breakdown: {
      type: Map,
      of: Number,
    },
  },
  { _id: false }
);

const DailyOperationSchema = new Schema<DailyOperationDoc>(
  {
    date: { type: String, required: true },
    site: { type: String, required: true },
    day: { type: String },
    activities: {
      type: Map,
      of: ActivitySchema,
    },
  },
  { 
    timestamps: true,
    strict: true
  }
);

DailyOperationSchema.index({ date: 1, site: 1 }, { unique: true });

export const DailyOperation = model<DailyOperationDoc>("DailyOperation", DailyOperationSchema);

// console.log("📋 DailyOperation Schema Paths:", Object.keys(DailyOperation.schema.paths));
// console.log("📋 Activities Schema:", DailyOperation.schema.path('activities'));