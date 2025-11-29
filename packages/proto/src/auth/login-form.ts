// proto/src/auth/login-form.ts
import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import reset from "../styles/reset.css.js";
import tokens from "../styles/tokens.css.js";

interface LoginFormData {
  username?: string;
  password?: string;
}

export class LoginFormElement extends LitElement {
  @state() formData: LoginFormData = {};
  @property() api?: string;
  @property() redirect: string = "/";
  @state() error?: string;

  get canSubmit() {
    return Boolean(this.api && this.formData.username && this.formData.password);
  }

  render() {
    return html`
      <form
        class="login-form"
        @change=${this.handleChange}
        @submit=${this.handleSubmit}
      >
        <slot></slot>
        <button ?disabled=${!this.canSubmit} type="submit">
          Sign In
        </button>
        <p class="error">${this.error}</p>
      </form>
    `;
  }

  static styles = [
    reset.styles,
    tokens.styles,
    css`
      .login-form {
        display: flex;
        flex-direction: column;
        gap: var(--size-spacing-medium);
        background: var(--color-surface);
        border-radius: var(--radius-large);
        padding: var(--size-spacing-large);
        box-shadow: var(--shadow-soft);
      }
      button {
        background: var(--color-accent);
        color: white;
        font-weight: bold;
        padding: var(--size-spacing-small);
        border: none;
        border-radius: var(--radius-medium);
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

  handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (!this.canSubmit) return;

    fetch(this.api || "", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.formData)
    })
      .then((res) => {
        if (res.status !== 200) throw new Error("Invalid trainer credentials");
        return res.json();
      })
      .then(({ token }) => {
        const event = new CustomEvent("auth:message", {
          bubbles: true,
          composed: true,
          detail: ["auth/signin", { token, redirect: this.redirect }]
        });
        this.dispatchEvent(event);
      })
      .catch((err: Error) => (this.error = err.message));
  }
}

