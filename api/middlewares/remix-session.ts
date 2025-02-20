import { createCookieSessionStorage } from "react-router";
import { session } from "remix-hono/session";
import { ENV } from '../env'

export default () => session({
  autoCommit: true,
  createSessionStorage() {
    const sessionStorage = createCookieSessionStorage({
      cookie: {
        name: "session",
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secrets: [ENV.SESSION_SECRET],
        secure: ENV.NODE_ENV === "production",
      },
    });

    return {
      ...sessionStorage,
      // If a user doesn't come back to the app within 30 days, their session will be deleted.
      async commitSession(session) {
        return sessionStorage.commitSession(session, {
          maxAge: ENV.SESSION_DURATION,
        });
      },
    };
  },
})
