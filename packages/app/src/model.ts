import { PkmCard } from "server/models";

export interface Model {
  card?: PkmCard;
  cards?: PkmCard[];
}

export const init: Model = {};