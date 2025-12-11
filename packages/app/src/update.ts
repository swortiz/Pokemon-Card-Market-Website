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
    
    case "card/save": {
      const { cardId } = message[1];
      const callbacks = message[2] || {};
      return [
        model,
        saveCard(message[1], user, callbacks)
          .then((card) => ["card/load", { cardId, card }])
      ];
    }
    
    default: {
      const unhandled: never = message[0];
      throw new Error(`Unhandled message "${unhandled}"`);
    }
  }
  
  return model;
}

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

function saveCard(
  msg: {
    cardId: string;
    card: PkmCard;
  },
  user: Auth.User,
  callbacks: {
    onSuccess?: () => void;
    onFailure?: (err: Error) => void;
  }
): Promise<PkmCard> {
  return fetch(`/api/cards/${msg.cardId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user)
    },
    body: JSON.stringify(msg.card)
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      throw new Error(`Failed to save card ${msg.cardId}`);
    })
    .then((json: unknown) => {
      if (json) {
        if (callbacks.onSuccess) callbacks.onSuccess();
        return json as PkmCard;
      }
      throw new Error("No JSON in API response");
    })
    .catch((err) => {
      if (callbacks.onFailure) callbacks.onFailure(err);
      throw err;
    });
}