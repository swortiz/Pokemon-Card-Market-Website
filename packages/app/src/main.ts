import {
    Auth,
    define,
    History,
    Switch,
    Store
  } from "@calpoly/mustang";
  import { html } from "lit";

  //MVU
  import { Msg } from "./messages";
  import { Model, init } from "./model";
  import update from "./update";
  
  //components
  import { HeaderElement } from "./components/pkmn-header";
  import { HomeViewElement } from "./views/home-view";
  import { PkmListViewElement } from "./views/pkm-list-view";
  import { PkmCardViewElement } from "./views/pkm-card-view";
  import { CartPageViewElement } from "./views/cart-page-view";
  import { LoginViewElement } from "./views/login-view";
  import { RegisterViewElement } from "./views/register-view";
  import { ProfileViewElement } from "./views/profile-view";
  import { LoginFormElement } from "./auth/login-form";
  import { PkmCardEditElement } from "./views/pkm-card-edit";
  
  //routes for pokemon app
  const routes = [
    {
        path: "/app/cards/:id/edit",
        view: (params: Switch.Params) => html`
          <pkm-card-edit card-id=${params.id}></pkm-card-edit>
        `
    },
    {
      path: "/app/cards/:id",
      view: (params: Switch.Params) => html`
        <pkm-card-view card-id=${params.id}></pkm-card-view>
      `
    },
    {
      path: "/app/cards",
      view: () => html`
        <pkm-list-view></pkm-list-view>
      `
    },
    {
      path: "/app/cart",
      view: () => html`
        <cart-page-view></cart-page-view>
      `
    },
    {
        path: "/app/login",
        view: () => html` <login-view></login-view> `
    },
    {
        path: "/app/register",
        view: () => html` <register-view></register-view> `
    },
    {
        path: "/app/profile",
        view: () => html` <profile-view></profile-view>`
    },  
    {
      path: "/app",
      view: () => html`
        <home-view></home-view>
      `
    },
    {
      path: "/",
      redirect: "/app"
    }
  ];

  //custom elements 
  define({
    "mu-auth": Auth.Provider,
    "mu-store": class AppStore extends Store.Provider<Model, Msg>{
        constructor(){
            super(update, init, "pokemon:auth");

        }
    },
    "mu-switch": class AppSwitch extends Switch.Element{
      constructor() {
        super(routes, "pokemon:history", "pokemon:auth");
      }
    },
    "mu-history": History.Provider,
    "pkmn-header": HeaderElement,
    "home-view": HomeViewElement,
    "pkm-list-view": PkmListViewElement,
    "pkm-card-view": PkmCardViewElement,
    "cart-page-view": CartPageViewElement,
    "login-view": LoginViewElement,
    "register-view": RegisterViewElement,
    "profile-view": ProfileViewElement,
    "pkmn-login": LoginFormElement,
    "pkm-card-edit": PkmCardEditElement
  });
  
