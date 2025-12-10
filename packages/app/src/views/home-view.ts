import { LitElement, html, css } from "lit";
import { state } from "lit/decorators.js";
import "../components/pkm-list";

export class HomeViewElement extends LitElement {
  static styles = css`
    aside{
        padding: 2rem;
    }
    h2 {
      margin-bottom: 1rem;
    }
  `;

  @state() cards = [];

  connectedCallback() {
    super.connectedCallback();
    console.log("HomeView connected. Fetching cards...");
  
    fetch("http://localhost:3000/api/pkmcards")
      .then((res) => {
        console.log("Response status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("Fetched cards:", data);
        this.cards = data;
      })
      .catch((err) => console.error("Fetch failed:", err));
  }

  render() {
    console.log("Rendering home-view, cards: ", this.cards);
    
    return html`
      <aside>
        <h2>Best Seller Pokémon</h2>
        <pkm-list .cards=${this.cards}></pkm-list>
      </aside>
    `;
  }
}
