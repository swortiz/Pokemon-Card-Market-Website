import { html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { define, Form, View, History } from "@calpoly/mustang";
import { PkmCard } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";

export class PkmCardEditElement extends View<Model, Msg> {
    static uses = define({
      "mu-form": Form.Element
    });

    @property({ attribute: "card-id" })
    cardId?: string;

    @state()
    get card(): PkmCard | undefined {
        return this.model.card;
    }

    constructor() {
        super("pokemon:model");
    }

    attributeChangedCallback(
        name: string,
        oldValue: string,
        newValue: string
    ) {
        super.attributeChangedCallback(name, oldValue, newValue);
        
        if (name === "card-id" && oldValue !== newValue && newValue) {
        console.log("Loading card for editing:", newValue);
        this.dispatchMessage([
            "card/request",
            { cardId: newValue }
        ]);
        }
    }

    render() {
        const { card } = this;
        
        if (!card || !card.name) {
        return html`<p>Loading card...</p>`;
        }

        return html`
        <main class="page">
            <h2>Edit Card: ${card.name}</h2>
            
            <mu-form
            .init=${card}
            @mu-form:submit=${this.handleSubmit}>
            
            <label>
                <span>Card Name</span>
                <input name="name" value="${card.name}" />
            </label>

            <label>
                <span>Type</span>
                <input name="type" value="${card.type}" />
            </label>

            <label>
                <span>Rarity</span>
                <input name="rarity" value="${card.rarity}" />
            </label>

            <label>
                <span>Image URL</span>
                <input name="imgSrc" value="${card.imgSrc}" />
            </label>

            <button type="submit">Save Changes</button>
            <a href="/app/cards/${card.id}">Cancel</a>
            </mu-form>
        </main>
        `;
    }

    handleSubmit(event: Form.SubmitEvent<PkmCard>) {
        console.log("Form submitted:", event.detail);
        
        this.dispatchMessage([
        "card/save",
        {
            cardId: this.cardId!,
            card: event.detail
        },
        {
            onSuccess: () => {
            console.log("Card saved successfully!");
            History.dispatch(this, "history/navigate", {
                href: `/app/cards/${this.cardId}`
            });
            },
            onFailure: (error: Error) => {
            console.error("Failed to save card:", error);
            alert("Failed to save card: " + error.message);
            }
        }
        ]);
    }

    static styles = css`
        :host {
        display: block;
        padding: 2rem;
        }
        
        mu-form {
        max-width: 500px;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        }
        
        label {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        }
        
        label span {
        font-weight: bold;
        }
        
        input {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        }
        
        button {
        padding: 0.75rem;
        background: var(--color-accent);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        }
        
        button:hover {
        opacity: 0.9;
        }
        
        a {
        text-align: center;
        padding: 0.75rem;
        }
    `;
}