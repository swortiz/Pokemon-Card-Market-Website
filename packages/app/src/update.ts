import { Auth, ThenUpdate } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import { PkmCard } from "server/models";

export default function update(
  message: Msg,
  model: Model,
  user: Auth.User
): Model | ThenUpdate<Model, Msg> {
  switch (message[0]) {
    case "card/request": {
      const { cardId } = message[1];
      if (model.card?.id === cardId) break;
      
      return [
        { ...model, card: { id: cardId } as PkmCard },
        requestCard(message[1], user)
          .then((card) => ["card/load", { cardId, card }])
      ];
    }
    
    case "card/load": {
      const { card } = message[1];
      return { ...model, card };
    }
    
    case "cards/request": {
      if (model.cards && model.cards.length > 0) break;
      
      return [
        model,
        requestCards(user)
          .then((cards) => ["cards/load", { cards }])
      ];
    }
    
    case "cards/load": {
      const { cards } = message[1];
      return { ...model, cards };
    }
    
    default:
      const unhandled: never = message[0];
      throw new Error(`Unhandled message "${unhandled}"`);
  }
  
  return model;
}

//Gets a single card
function requestCard(
  payload: { cardId: string },
  user: Auth.User
): Promise<PkmCard> {
  return fetch(`/api/cards/${payload.cardId}`, {
    headers: Auth.headers(user)
  })
    .then((response) => {
      if (response.status === 200) return response.json();
      throw new Error("Failed to fetch card");
    })
    .then((json) => json as PkmCard);
}

//Gets all the cards 
function requestCards(user: Auth.User): Promise<PkmCard[]> {
  return fetch("/api/cards", {
    headers: Auth.headers(user)
  })
    .then((response) => {
      if (response.status === 200) return response.json();
      throw new Error("Failed to fetch cards");
    })
    .then((json) => json as PkmCard[]);
}