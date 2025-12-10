import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";

export class PkmCardViewElement extends LitElement {
  @property({ attribute: "card-id" })
  cardId!: string;

  @state()
  card: any = null;

  connectedCallback() {
    super.connectedCallback();
    fetch(`http://localhost:3000/api/pkmcards/${this.cardId}`)
      .then((r) => r.json())
      .then((data) => (this.card = data));
  }

  render() {
    return html`
      ${this.card
        ? html`<pkm-card .card=${this.card}></pkm-card>`
        : html`<p>Loading...</p>`}
    `;
  }
}
