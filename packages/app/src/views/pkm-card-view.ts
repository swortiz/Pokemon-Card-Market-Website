import { html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { View } from "@calpoly/mustang";
import { PkmCard } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";

export class PkmCardViewElement extends View<Model, Msg> {
  @property({ attribute: "card-id" })
  cardId?: string;

  @state()
  get card(): PkmCard | undefined {
    return this.model.card;
  }

  constructor() {
    super("pokemon:model");
  }

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ) {
    super.attributeChangedCallback(name, oldValue, newValue);
    
    if (name === "card-id" && oldValue !== newValue && newValue) {
      console.log("Requesting card:", newValue);
      this.dispatchMessage([
        "card/request",
        { cardId: newValue }
      ]);
    }
  }

  render() {
    const { card } = this;
    
    if (!card || !card.name) {
      return html`<p>Loading card...</p>`;
    }
    
    return html`
    <article class="card-detail">
      <h2>${card.name}</h2>
      <img src="${card.imgSrc}" alt="${card.name}" />
      <dl>
        <dt>Type:</dt>
        <dd>${card.type}</dd>
        
        <dt>Rarity:</dt>
        <dd>${card.rarity}</dd>
      </dl>
      <div class="actions">
        <a href="/app/cards/${card.id}/edit">Edit Card</a>
        <a href="/app/cards">← Back to all cards</a>
      </div>
    </article>
  `;
  }

  static styles = css`
    :host {
      display: block;
      padding: 2rem;
    }
  `;
}
