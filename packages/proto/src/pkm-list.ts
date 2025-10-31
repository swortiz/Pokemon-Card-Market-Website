import {html, css, LitElement} from "lit";
import {property, state} from "lit/decorators.js";
import "./pkm-card";

interface Card{
	name: string;
	type: string;
	rarity: string;
	imgSrc: string;
	link: string;
}

export class PkmListElement extends LitElement {

	@property() src?: string;
	@state() cards: Array<Card> = [];

	connectedCallback(){
		super.connectedCallback();
		if(this.src) this.hydrate(this.src);
	}
	hydrate(src: string){
		fetch(src)
			.then((res) => res.json())
			.then((json: Array<Card>) => {
				this.cards = json;
			})
			.catch((err) => console.error("Error loading the data:", err));
	}
	render(){
		return html`
		<ul>
		  ${this.cards.map(
			(c) => html`
			  <li>
				<pkm-card
				  img-src=${c.imgSrc}
				  href=${c.link}
				  name=${c.name}
				  type=${c.type}
				  rarity=${c.rarity}
				></pkm-card>
			  </li>
		  `
		  )}
		</ul>
	  `;
	}
	static styles = css`
	  ul {
		list-style: none;
		padding: 0;
	  }
	  li {
	  	margin: 0.5rem 0;
	  }
	`;
}
