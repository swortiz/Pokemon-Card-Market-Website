import {html, css, LitElement} from "lit";
import {customElement, property} from "lit/decorators.js";
import reset from "../styles/reset.css.ts";
import { addToCart } from "../store/cart-store.ts";



@customElement("pkm-card")
export class PkmCardElement extends LitElement {

	@property({ type: String }) imgSrc = "";
	@property({ type: String }) name = "";
	@property({ type: String }) type = "";
	@property({ type: String }) rarity = "";

	handleClick() {
		addToCart({
		  imgSrc: this.imgSrc,
		  name: this.name,
		  type: this.type,
		  rarity: this.rarity
		});
	  }
	  addToCart() {
		addToCart({
		  imgSrc: this.imgSrc,
		  name: this.name,
		  type: this.type,
		  rarity: this.rarity
		});
		this.showAddedPopup();
	  }
	  
	  showAddedPopup() {
		const popup = document.getElementById("cart-popup");
		if(!popup) return;
		popup.classList.add("show");
	  
		setTimeout(() => {
		  popup.classList.remove("show");
		}, 1200); 
	  }

	  override render() {
		//const isSprite = this.imgSrc.includes("#");
		return html`
		  <article @click=${this.addToCart}>
		    <img src=${this.imgSrc} alt=${this.name} />
		 	<h3>${this.name}</h3>
			<p><strong>Type:</strong>${this.type}</p>
			<p><strong>Rarity:</strong>${this.rarity}</p>
		  </article>
		`;
	  }
	static styles = [
	  reset.styles,
	  css`
	   :host{
		display: block;
		background-color: var(--color-background-card, white);
		border: 2px solid var(--color-card-border, #e3350d);
		border-radius: 8px;
		padding: 1 rem;
		text-align: center;
		box-shadow: 0 4px 6px rgba(0, 0 , 0, 0.1);
		transition: transform 0.2s ease;
	   }
	   

	   :host(:hover) {
		transform: scale(0.97);
	   }
	   img {
		width: 120px;
		margin-bottom: 0.5rem;
	   }
	   h3{
		margin: 0.5rem 0 0.25rem;
      		font-family: var(--font-family-heading);
      		color: var(--color-accent);
	   }
	   .pkm-icon {
		display: block;
		margin: 0 auto;
		fill: var(--color-text-default);
	   }
	   p {
     	 	font-family: var(--font-family-base);
      		font-size: 0.9rem;
      		color: var(--color-text-default);
    	}

	`
	];
}
