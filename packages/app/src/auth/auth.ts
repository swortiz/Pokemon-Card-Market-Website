import type { SessionUser } from "./types";

let session: SessionUser | null = null;

export function setSession(user: SessionUser | null) {
  session = user;
  console.log("SESSION UPDATED:", session);
}

export function currentUser(): SessionUser | null {
  return session;
}

export function isSignedIn(): boolean {
  return Boolean(session);
}

export function username(): string | null {
  return session?.username ?? null;
}

export async function authFetch(
  url: string,
  options: RequestInit = {}
) {
  const headers = new Headers(options.headers);

  if (session?.token) {
    headers.set("Authorization", `Bearer ${session.token}`);
  }

  return fetch(url, { ...options, headers });
}

// Handle login form auth event
window.addEventListener("auth:message", (event: Event) => {
  const custom = event as CustomEvent;
  const [action, payload] = custom.detail;

  if (action === "auth/signin") {
    const { token, redirect } = payload;

    // Store the session
    setSession({
      username: "unknown", 
      token
    });

    // Redirect if requested
    if (redirect) window.location.assign(redirect);
  }
});
