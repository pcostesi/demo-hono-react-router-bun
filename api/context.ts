import { createGetLoadContext } from "react-router-hono-server/bun";
import { CLIENT_ENV } from "./env";

/**
 * Declare our loaders and actions context type
 */
declare module "react-router" {
  interface AppLoadContext {
    /**
     * The app version from the build assets
     */
    readonly appVersion: string;
  }
}

export const getLoadContext = createGetLoadContext((_, { mode, build }) => {
  const isProductionMode = mode === "production";
  return {
    appVersion: isProductionMode ? build.assets.version : "dev",
    env: CLIENT_ENV
  };
});
