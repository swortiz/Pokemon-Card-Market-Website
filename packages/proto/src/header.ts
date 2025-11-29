// proto/src/header.ts
import { html, css, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { Observer, Events, Auth } from "@calpoly/mustang";

export class HeaderElement extends LitElement {
  _authObserver = new Observer<Auth.Model>(this, "pokemon:auth");

  @state() loggedIn = false;
  @state() trainerName?: string;

  connectedCallback() {
    super.connectedCallback();

    // Observe login/logout changes
    this._authObserver.observe((auth: Auth.Model) => {
      const { user } = auth;
      if (user && user.authenticated) {
        this.loggedIn = true;
        this.trainerName = user.username;
      } else {
        this.loggedIn = false;
        this.trainerName = undefined;
      }
    });
  }

  render() {
    return html`
      <div class="auth-status">
        ${this.loggedIn
          ? html`
              <span>Hello, ${this.trainerName}!</span>
              <button
                class="signout"
                @click=${(e: UIEvent) =>
                  Events.relay(e, "auth:message", ["auth/signout"])}
              >
                Sign Out
              </button>
            `
          : html`<a class="signin" href="/login.html">Sign In</a>`}
      </div>
    `;
  }

  static styles = css`
    .auth-status {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-family: "Open Sans", sans-serif;
    }
    .signin,
    .signout {
      cursor: pointer;
      font-weight: bold;
      border: none;
      background: none;
      color: var(--color-accent, #e63946);
    }
  `;
}

customElements.define("pkmn-header", HeaderElement);

