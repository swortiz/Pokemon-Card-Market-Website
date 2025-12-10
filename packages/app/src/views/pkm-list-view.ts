import { LitElement, html } from "lit";
import { state } from "lit/decorators.js";
import "../components/pkm-list"

export class PkmListViewElement extends LitElement {
  @state() cards = [];

  connectedCallback() {
    super.connectedCallback();
    fetch("http://localhost:3000/api/pkmcards")
      .then((r) => r.json())
      .then((data) => (this.cards = data));
  }

  render() {
    return html`
      <h2>All Pokémon Cards</h2>
      <pkm-list .cards=${this.cards}></pkm-list>
    `;
  }
}
