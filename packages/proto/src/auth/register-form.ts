import { html, css, LitElement } from "lit";
import { state, property } from "lit/decorators.js";
import reset from "../styles/reset.css.js";
import tokens from "../styles/tokens.css.js";

interface RegisterFormData {
  username?: string;
  password?: string;
}

export class RegisterFormElement extends LitElement {
  @state() formData: RegisterFormData = {};
  @state() error?: string;
  @property() api: string = "http://localhost:3000/auth/register";
  @property() redirect: string = "/";

  render() {
    return html`
      <form class="register-form" @change=${this.handleChange} @submit=${this.handleSubmit}>
        <h2>Create New Trainer Account</h2>

        <label>Trainer Name</label>
        <input name="username" />

        <label>Password</label>
        <input name="password" type="password" />

        <button type="submit">Create Account</button>

        <p class="error">${this.error}</p>
      </form>
    `;
  }

  static styles = [
    reset.styles,
    tokens.styles,
    css`
      .register-form {
        display: flex;
        flex-direction: column;
        gap: var(--size-spacing-medium);
        background: var(--color-surface);
        padding: var(--size-spacing-large);
        border-radius: var(--radius-large);
        box-shadow: var(--shadow-soft);
      }
      button {
        background: var(--color-accent);
        color: white;
        padding: var(--size-spacing-small);
        border-radius: var(--radius-medium);
        border: none;
        cursor: pointer;
      }
      .error:not(:empty) {
        color: var(--color-error);
        border: 1px solid var(--color-error);
        padding: var(--size-spacing-small);
      }
    `
  ];

  handleChange(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    const { name, value } = target;
    this.formData = { ...this.formData, [name]: value };
  }

  async handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    try {
      const res = await fetch(this.api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.formData)
      });

      if (!res.ok) throw new Error("Unable to register new trainer");

      alert("Trainer created! You can now sign in.");
      window.location.href = this.redirect;
    } catch (err: any) {
      this.error = err.message;
    }
  }
}

customElements.define("pkm-register-form", RegisterFormElement);