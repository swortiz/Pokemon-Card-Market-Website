export interface CartItem {
  name: string;
  imgSrc: string;
  type: string;
  rarity: string;
}

let cart: CartItem[] = [];

const listeners = new Set<(items: CartItem[]) => void>();

export const cartStore = {
  subscribe(fn: (items: CartItem[]) => void) {
    listeners.add(fn);
  },
  notify() {
    for (const fn of listeners) fn(cart);
  }
};


export async function loadCart(): Promise<CartItem[]> {
  const saved = localStorage.getItem("pkm-cart");
  cart = saved ? JSON.parse(saved) : [];
  return cart;
}

function saveCart() {
  localStorage.setItem("pkm-cart", JSON.stringify(cart));
  cartStore.notify();
}


export function addToCart(item: CartItem) {
  cart.push(item);
  saveCart();
}


export function removeFromCart(name: string) {
  cart = cart.filter((i) => i.name !== name);
  saveCart();
}
