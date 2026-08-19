import type { Persistence } from "firebase/auth";

/**
 * `getReactNativePersistence` only exists in the React Native build of the
 * Firebase SDK (`@firebase/auth/dist/rn`). Metro resolves that build through
 * the "react-native" export condition, but TypeScript resolves the browser
 * typings, so the symbol has to be declared here.
 */
declare module "firebase/auth" {
  export function getReactNativePersistence(storage: unknown): Persistence;
}
