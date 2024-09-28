// session.server.ts
import { createCookieSessionStorage } from "@remix-run/node";

let sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

export let { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "user_session",
      secure: process.env.NODE_ENV === "production",
      secrets: [sessionSecret],
      sameSite: "lax",
      path: "/",
      httpOnly: true,
    },
  });
