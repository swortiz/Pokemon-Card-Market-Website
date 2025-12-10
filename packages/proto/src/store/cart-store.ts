import { pubsub } from "../pubsub.js";
interface CartItem {
    name: string;
    imgSrc: string;
    type: string;
    rarity: string;
  }

//Detect if user is logged in (Mustang Auth)
function getAuthToken() {
  const auth = document.querySelector("mu-auth") as any;
  return auth?.session?.token || null;
}

/**
 * Load cart:
 *  - From MongoDB if logged in
 *  - From localStorage if not
 */
export async function loadCart() {
  const token = getAuthToken();

  if (!token) {
    // Guest mode cart
    const local = localStorage.getItem("cart");
    return local ? JSON.parse(local) : [];
  }

  // Logged in → fetch from server
  const res = await fetch("/cart", {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) return [];

  const data = await res.json();
  return data.cart || [];
}


 //Save cart to the correct storage: MongoDB or localStorage
async function saveCart(cart: CartItem[]) {
  const token = getAuthToken();

  if (!token) {
    // Guest user
    localStorage.setItem("cart", JSON.stringify(cart));
    pubsub.publish("cart-updated", cart);
    return;
  }

  // Logged in user → send to backend
  await fetch("/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ cart })
  });

  pubsub.publish("cart-updated", cart);
}


 //Add item to cart
export async function addToCart(item: CartItem) {
  const current = await loadCart();
  const updated = [...current, item];
  await saveCart(updated);
}


 //Remove item by name
export async function removeFromCart(name: string): Promise<void> {
  const current = await loadCart();
  const updated = current.filter((item: CartItem) => item.name !== name);
  await saveCart(updated);
}
