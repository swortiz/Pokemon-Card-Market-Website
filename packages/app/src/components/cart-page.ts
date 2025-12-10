import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { loadCart, removeFromCart, cartStore } from "../store/cart-store";

interface CartItem {
  name: string;
  imgSrc: string;
  type: string;
  rarity: string;
}

@customElement("cart-page")
export class CartPage extends LitElement {
  @state() items: CartItem[] = [];

  constructor() {
    super();

    // Load initial cart
    loadCart().then((cart: CartItem[]) => {
      this.items = cart;
    });

    // React to cart updates
    cartStore.subscribe((cart: CartItem[]) => {
      this.items = [...cart];
      this.requestUpdate();
    });
  }

  render() {
    return html`
      <section class="wrapper">
        <h2>Your Cart</h2>

        ${this.items.length === 0
          ? html`<p class="empty">Your cart is empty.</p>`
          : html`
              <div class="cart-list">
                ${this.items.map(
                  (item) => html`
                    <div class="cart-item">
                      <img src="${item.imgSrc}" alt="${item.name}" />

                      <div class="info">
                        <h3>${item.name}</h3>
                        <p>${item.type} • ${item.rarity}</p>

                        <button
                          class="remove-btn"
                          @click=${() => removeFromCart(item.name)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  `
                )}
              </div>
            `}
      </section>
    `;
  }

  static styles = css`
  .wrapper {
    max-width: 800px;
    margin: 2rem auto;
    padding: 1.5rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    text-align: center;
    color: var(--color-accent, #e3350d);
    font-family: var(--font-family-heading);
    margin-bottom: 1rem;
  }

  .empty {
    text-align: center;
    font-size: 1.1rem;
    color: #666;
    padding: 2rem 0;
  }

  .cart-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .cart-item {
    display: flex;
    gap: 1rem;
    border: 2px solid var(--color-accent, #e3350d);
    padding: 1rem;
    border-radius: 10px;
    background-color: #fffaf4;
    align-items: center;
  }

  img {
    width: 120px;
    height: auto;
    border-radius: 8px;
  }

  .info h3 {
    margin: 0;
    font-family: var(--font-family-heading);
    color: var(--color-accent, #e3350d);
  }

  .info p {
    margin: 0.3rem 0 1rem;
    color: #444;
  }

  .remove-btn {
    background-color: var(--color-accent, #e3350d);
    border: none;
    color: white;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    border-radius: 6px;
    cursor: pointer;
  }

  .remove-btn:hover {
    opacity: 0.85;
  }

  
  .button-primary {
    background: var(--color-accent, #e3350d);
    color: white;
    padding: 0.6rem 1.4rem;
    font-weight: bold;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
  }

  .back-btn-wrapper {
    text-align: center;
    margin-top: 2rem;
  }

  .button-primary:hover {
    opacity: 0.9;
  }

  
  #cart-popup {
    position: fixed;
    bottom: 25px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--color-accent, #e3350d);
    color: white;
    padding: 0.7rem 1.2rem;
    border-radius: 8px;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    font-size: 1rem;
  }

  #cart-popup.show {
    opacity: 1;
  }
`;
}
