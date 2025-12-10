import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { Observer, Auth } from "@calpoly/mustang";
import "../components/pkmn-header";

@customElement("profile-view")
export class ProfileViewElement extends LitElement {
  _auth = new Observer<Auth.Model>(this, "pokemon:auth");

  username: string | null = null;

  static styles = css`
    main {
      max-width: 600px;
      margin: 2rem auto;
      text-align: center;
    }
    h1 {
      margin-bottom: 1rem;
    }
    .back-button {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-weight: bold;
      padding: 0.7rem 1.2rem;
      background: var(--color-accent);
      color: white;
      border-radius: 8px;
      text-decoration: none;
    }
  `;

  connectedCallback() {
    super.connectedCallback();

    //Get user from auth store
    this._auth.observe((auth: Auth.Model) => {
      const user = auth.user;
      if (user && user.authenticated) {
        this.username = user.username ?? null;
      }
    });
  }

  render() {
    return html`
      <main>
        <h1>Your Trainer Profile</h1>

        <h2>Welcome, ${this.username ?? "Trainer"}!</h2>

        <p>You are now logged in.</p>

        <a class="back-button" href="/app">
          ← Back to Home
        </a>
      </main>
    `;
  }
}
