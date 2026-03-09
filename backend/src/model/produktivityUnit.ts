import mongoose, { Schema, Document } from "mongoose";

export interface IProductionUnit extends Document {
  date: string;
  site: string;
  activity: string;
  unit: string;
  plan: number;
  pa: number;
  ua: number;
  ma: number;
  eu: number;
  produktivityIndex: {
    lbgJam: number;
    mtrJam: number;
    ltrMtr: number;
  };
}

const produktivityIndexSchema = new Schema(
  {
    lbgJam: { type: Number, required: true },
    mtrJam: { type: Number, required: true },
    ltrMtr: { type: Number, required: true },
  },
  { _id: false }
);

const productionUnitSchema = new Schema<IProductionUnit>(
  {
    date: {
      type: String,
      required: true,
      index: true,
    },

    site: {
      type: String,
      required: true,
      index: true,
    },

    activity: {
      type: String,
      required: true,
      index: true,
    },

    unit: {
      type: String,
      required: true,
    },

    plan: {
      type: Number,
      default: 0,
    },

    pa: {
      type: Number,
      default: 0,
    },

    ua: {
      type: Number,
      default: 0,
    },

    ma: {
      type: Number,
      default: 0,
    },

    eu: {
      type: Number,
      default: 0,
    },

    produktivityIndex: {
      type: produktivityIndexSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ProductionUnits = mongoose.model<IProductionUnit>(
  "ProductionUnit",
  productionUnitSchema
);