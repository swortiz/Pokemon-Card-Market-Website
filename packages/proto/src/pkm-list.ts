import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import { Auth, Observer } from "@calpoly/mustang";
import "./pkm-card";

interface Card {
  name: string;
  type: string;
  rarity: string;
  imgSrc: string;
  link: string;
}

export class PkmListElement extends LitElement {
  @property() src?: string;
  @state() cards: Array<Card> = [];

  
  _authObserver = new Observer<Auth.Model>(this, "pokemon:auth");
  _user?: Auth.User;

  connectedCallback() {
    super.connectedCallback();

    
    this._authObserver.observe((auth: Auth.Model) => {
      this._user = auth.user;
      if (this.src) this.hydrate(this.src);
    });
  }

  get authorization() {
    return (
      this._user?.authenticated && {
        Authorization: `Bearer ${(this._user as Auth.AuthenticatedUser).token}`,
      }
    );
  }

  hydrate(src: string) {
    const options: RequestInit = {};

    if (this.authorization && typeof this.authorization === "object") {
      options.headers = this.authorization as any;
    }
    fetch(src, options)
      .then((res) => {
        if (res.status === 401) {
          console.warn("Unauthorized — please sign in first.");
          return [];
        }
        return res.json();
      })
      .then((json: Array<Card>) => {
        this.cards = json;
      })
      .catch((err) => console.error("Error loading data:", err));
  }

  render() {
    return html`
      <ul>
        ${this.cards.map(
          (c) => html`
            <li>
              <pkm-card
                img-src=${c.imgSrc}
                href=${c.link}
                name=${c.name}
                type=${c.type}
                rarity=${c.rarity}
              ></pkm-card>
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

