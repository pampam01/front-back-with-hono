import { createKindeServerClient, GrantType, type SessionManager, type UserType } from "@kinde-oss/kinde-typescript-sdk";
import { type Context } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { createFactory, createMiddleware } from "hono/factory";



// Client for authorization code flow
export const kindeClient = createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
  authDomain: process.env.KINDE_DOMAIN!,
  clientId: process.env.KINDE_CLIENT_ID!,
  clientSecret: process.env.KINDE_CLIENT_SECRET!,
  redirectURL: process.env.KINDE_REDIRECT_URI!,
  logoutRedirectURL: process.env.KINDE_LOGOUT_REDIRECT_URI!,
});


let store: Record<string, unknown> = {};

// Session manager for server-side sessions
export const sessionManager = (c: Context): SessionManager => ({
  async getSessionItem(key: string) {
    const result = getCookie(c, key);
    return result;
  },
  async setSessionItem(key: string, value: unknown) {
    const cookiesOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "lax"
    } as const;

    if (typeof value === "string") {
      setCookie(c, key, value, cookiesOptions);
    } else {
      setCookie(c, key, JSON.stringify(value), cookiesOptions);
    }
  },

  async removeSessionItem(key: string) {
    deleteCookie(c, key);
  },

  async destroySession() {
    ["access_token", "refresh_token", "id_token", "user"].forEach(key => {
      deleteCookie(c, key);
    });
  },
})

type Env = {
  Variables: {
    user: UserType;
  }
}





export const getUser = createMiddleware<Env>(async (c, next) => {
  try {
    const manager = sessionManager(c);
    const isAuthenticated = await kindeClient.isAuthenticated(manager);
    if (!isAuthenticated) {
      return c.json({ message: "Not authenticated" }, 401);
    } else {
      const user = await kindeClient.getUserProfile(manager);
      c.set("user", user);
      await next();
    }
  } catch (error) {
    console.error(error);
    return c.json({ message: "Unauthorized" }, 401);
  }

})








