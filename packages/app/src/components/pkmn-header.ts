import { html, css, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { Observer, Auth } from "@calpoly/mustang";

export class HeaderElement extends LitElement {
  //Observe Mustang auth store
  private _auth = new Observer<Auth.Model>(this, "pokemon:auth");

  @state() loggedIn = false;
  @state() trainerName?: string;

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();

    this._auth.observe((auth: Auth.Model) => {
      const user = auth.user;

      if (user?.authenticated) {
        this.loggedIn = true;
        this.trainerName = user.username;
      } else {
        this.loggedIn = false;
        this.trainerName = undefined;
      }
    });
  }

  toggleDarkMode(e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    document.body.classList.toggle("dark-mode", checked);
  }

  render() {
    return html`
      <style>
        header.site-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: var(--color-background-header);
          padding: 1rem;
        }
  
        h1 {
          background-color: var(--color-accent);
          color: var(--color-text-inverted);
          padding: 1rem;
          margin: 0;
          font-size: 1.4rem;
        }
  
        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
  
        .header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
  
        .nav-link,
        .signin,
        .signout {
          font-weight: bold;
          color: var(--color-accent);
          text-decoration: none;
          cursor: pointer;
        }
  
        .signout {
          border: none;
          background: none;
          padding: 0;
          font-size: inherit;
          font-family: inherit;
        }
  
        .nav-link:hover,
        .signin:hover,
        .signout:hover {
          text-decoration: underline;
        }
      </style>
  
      <header class="site-header">
        <div class="header-left">
          <svg class="icon" width="50" height="50">
            <use href="/icons/pokemon.svg#pokemon-icon"></use>
          </svg>
          <h1>Welcome to the Pokémon Card Market</h1>
        </div>
  
        <div class="header-right">
          <label id="darkmode-toggle">
            <input type="checkbox" @change=${this.toggleDarkMode} />
            Dark mode
          </label>
  
          <a class="nav-link" href="/app/cart">Cart</a>
  
          ${this.loggedIn
            ? html`
                <span>Hello, ${this.trainerName}!</span>
                <a class="nav-link" href="/app/profile">Profile</a>
                <button 
                  class="signout" 
                  type="button"
                  @click=${this.signOut}
                >
                  Sign Out
                </button>
              `
            : html`<a class="signin" href="/app/login">Sign In</a>`}
        </div>
      </header>
    `;
  }

  signOut(event: Event) {
    console.log("Sign out clicked!"); 
    event.preventDefault();
    
    // Clear localStorage manually to ensure logout
    localStorage.removeItem('pokemon:auth');
    
    // Dispatch the auth signout message
    this.dispatchEvent(
      new CustomEvent("auth:message", {
        bubbles: true,
        composed: true,
        detail: ["auth/signout"]
      })
    );
    
    // Update local state immediately
    this.loggedIn = false;
    this.trainerName = undefined;
    
    // Navigate to home
    window.history.pushState({}, "", "/app");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  static styles = css`
    header.site-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: var(--color-background-header);
      padding: 1rem;
    }

    h1 {
      background-color: var(--color-accent);
      color: var(--color-text-inverted);
      padding: 1rem;
      margin: 0;
      font-size: 1.4rem;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .signin,
    .signout {
      font-weight: bold;
      border: none;
      background: none;
      cursor: pointer;
      color: var(--color-accent);
      padding: 0.5rem 1rem;
      text-decoration: underline;
      pointer-events: auto;
      z-index: 10;
    }

    .signout:hover {
      opacity: 0.8;
    }
  `;
}