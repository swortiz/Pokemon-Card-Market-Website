import { PkmCard } from "server/models";

export type Msg =
  | ["card/request", { cardId: string }]
  | ["card/load", { cardId: string; card: PkmCard }]
  | ["cards/request"]
  | ["cards/load", { cards: PkmCard[] }];