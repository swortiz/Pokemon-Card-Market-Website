import { html, css, LitElement } from "lit";
import { property } from "lit/decorators.js";
import "./pkm-card";
interface Card {
    name: string;
    type: string;
    rarity: string;
    imgSrc: string;
  }
export class PkmListElement extends LitElement {
  @property({ type: Array }) cards: Card[] = [];

  render() {
    return html`
      <ul>
        ${this.cards.map(
          (c) => html`
            <li>
              <a href="/app/cards/${c.id}" class="card-link">
                <pkm-card
                    .imgSrc=${c.imgSrc}
                    .name=${c.name}
                    .type=${c.type}
                    .rarity=${c.rarity}
                ></pkm-card>
              </a>
            </li>
          `
        )}
      </ul>
    `;
  }

  static styles = css`
    ul {
      list-style: none;
      padding: 0;
    }
    li {
      margin: 0.5rem 0;
    }
  `;
}

customElements.define("pkm-list", PkmListElement);
