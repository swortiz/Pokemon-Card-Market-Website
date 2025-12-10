import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import "../auth/login-form";

@customElement("login-view")
export class LoginViewElement extends LitElement {
    
    createRenderRoot() {
        return this;
    }
  static styles = css`
    .wrapper {
      max-width: 400px;
      margin: 3rem auto;
      padding: 2rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }
    h2 {
      text-align: center;
      margin-bottom: 1rem;
    }
    p {
      text-align: center;
      margin-top: 1rem;
    }
  `;

  render() {
    return html`
      <div class="wrapper">
        <pkmn-login
          api="/auth/login"
          redirect="/app/profile"
        >
        </pkmn-login>
  
        <p>
          Don't have an account?
          <a href="/app/register">Register</a>
        </p>
      </div>
    `;
  }
}
