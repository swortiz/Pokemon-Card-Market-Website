import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import "../auth/register-form";

@customElement("register-view")
export class RegisterViewElement extends LitElement {
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
        <pkm-register-form
          api="http://localhost:3000/auth/register"
          redirect="/app/login"
        >
        </pkm-register-form>

        <p>
          Already have an account?
          <a href="/app/login">Sign in</a>
        </p>
      </div>
    `;
  }
}
