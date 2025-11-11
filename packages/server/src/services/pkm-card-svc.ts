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
function create(json: PkmCard): Promise<PkmCard> {
  const c = new PkmCardModel(json);
  return c.save();
}

function update(id: string, card: PkmCard): Promise<PkmCard> {
  return PkmCardModel.findOneAndUpdate({ id }, card, { new: true })
    .then((updated) => {
      if (!updated) throw `${id} not updated`;
      return updated as PkmCard;
    });
}

function remove(id: string): Promise<void> {
  return PkmCardModel.findOneAndDelete({ id }).then((deleted) => {
    if (!deleted) throw `${id} not deleted`;
  });
}
export default { index, get, create, update, remove };
