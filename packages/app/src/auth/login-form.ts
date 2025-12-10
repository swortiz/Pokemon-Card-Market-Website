// app/src/auth/login-form.ts
import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import reset from "../styles/reset.css.ts";
import tokens from "../styles/tokens.css.ts";

interface LoginFormData {
  username?: string;
  password?: string;
}

export class LoginFormElement extends LitElement {
  
  createRenderRoot() {
    return this;
  }

  @state() formData: LoginFormData = {};
  @property() api?: string;
  @property() redirect: string = "/";
  @state() error?: string;

  get canSubmit() {
    return Boolean(this.api && this.formData.username && this.formData.password);
  }

  render() {
    return html`
    <form class="login-form" @submit=${this.handleSubmit}>
    <h2>Trainer Login</h2>

    <label>
      <span>Trainer Name:</span>
      <input name="username" @input=${this.handleChange} />
    </label>

    <label>
      <span>Password:</span>
      <input name="password" type="password" @input=${this.handleChange} />
    </label>

    <button type="submit">Sign In</button>
    <p class="error">${this.error}</p>
  </form>
`;
  }

  static styles = [
    reset.styles,
    tokens.styles,
  ];

  handleChange(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    const { name, value } = target;
    this.formData = { ...this.formData, [name]: value };
  }

  handleSubmit(event: SubmitEvent) {
    console.log("HANDLE SUBMIT FIRED");
    console.log("API:", this.api);
    console.log("FORM DATA:", this.formData);
  
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
        console.log("LOGIN SUCCESS — token:", token);
        
        // Dispatch auth event
        this.dispatchEvent(
          new CustomEvent("auth:message", {
            bubbles: true,
            composed: true,
            detail: ["auth/signin", { token, username: this.formData.username }]
          })
        );
        
        // Navigate without page reload
        window.history.pushState({}, "", this.redirect);
        window.dispatchEvent(new PopStateEvent("popstate"));
      })
      .catch((err) => {
        this.error = err.message;
      });
  }
}