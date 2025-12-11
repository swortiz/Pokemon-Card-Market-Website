import { Auth, ThenUpdate } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import { PkmCard } from "server/models";

export default function update(
  message: Msg,
  model: Model,
  user: Auth.User
): Model | ThenUpdate<Model, Msg> {
  const [command, payload, callbacks] = message as [
    string,
    any,
    { onSuccess?: () => void; onFailure?: (err: Error) => void } | undefined
  ];
  
  switch (command) {
    case "card/request": {
      const { cardId } = payload;
      if (model.card?.id === cardId) break;
      
      return [
        { ...model, card: { id: cardId } as PkmCard },
        requestCard(payload, user)
          .then((card) => ["card/load", { cardId, card }])
      ];
    }
    
    case "card/load": {
      const { card } = payload;
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
      const { cards } = payload;
      return { ...model, cards };
    }
    
    case "card/save": {
      const { cardId } = payload;
      return [
        model,
        saveCard(payload, user, callbacks || {})
          .then((card) => ["card/load", { cardId, card }])
      ];
    }
    
    default:
      const unhandled: never = command;
      throw new Error(`Unhandled message "${unhandled}"`);
  }
  
  return model;
}

// functions
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

//Save card 
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