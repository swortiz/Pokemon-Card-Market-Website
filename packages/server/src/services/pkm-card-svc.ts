// src/services/pkm-card-svc.ts
import { Schema, model } from "mongoose";
import { PkmCard } from "../models/pkm-card";

const PkmCardSchema = new Schema<PkmCard>(
  {
    id: { type: String, required: true, trim: true, unique: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    rarity: { type: String, required: true, trim: true },
    imgSrc: { type: String, required: true, trim: true }
  },
  { collection: "pkm_cards" }
);

const PkmCardModel = model<PkmCard>("PkmCard", PkmCardSchema);

function index(): Promise<PkmCard[]> {
  return PkmCardModel.find();
}

function get(id: string): Promise<PkmCard | null> {
  return PkmCardModel.findOne({ id });
}

export default { index, get };
