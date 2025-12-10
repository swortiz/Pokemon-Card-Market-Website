import {  html, css } from "lit";
import { state } from "lit/decorators.js";
import { View } from "@calpoly/mustang";
import { PkmCard } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import "../components/pkm-list"

export class PkmListViewElement extends View<Model, Msg> {
    @state()
    get cards(): PkmCard[] | undefined {
      return this.model.cards;
    }
  
    constructor() {
      super("pokemon:model");
    }
  
    connectedCallback() {
      super.connectedCallback();
      console.log("Requesting all cards");
      this.dispatchMessage(["cards/request"]);
    }
  
    render() {
      const { cards } = this;
      
      if (!cards) {
        return html`
          <h2>All Pokémon Cards</h2>
          <p>Loading cards...</p>
        `;
      }
  
      return html`
        <h2>All Pokémon Cards</h2>
        <pkm-list .cards=${cards}></pkm-list>
      `;
    }
  
    static styles = css`
    :host {
      display: block;
      padding: 2rem;
    }
  `;
}
