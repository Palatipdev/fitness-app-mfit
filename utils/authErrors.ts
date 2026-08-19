/**
 * Maps Firebase auth codes to messages that say what went wrong and what to do
 * about it. Anything unrecognised falls back to a generic retry message rather
 * than leaking an SDK string into the UI.
 */
const MESSAGES: Record<string, string> = {
  "auth/invalid-credential": "That email and password do not match. Try again.",
  "auth/wrong-password": "That password is not right. Try again.",
  "auth/user-not-found": "No account uses that email. Check it or sign up.",
  "auth/invalid-email": "That email address is not formatted correctly.",
  "auth/email-already-in-use": "That email already has an account. Sign in instead.",
  "auth/weak-password": "Pick a password with at least 6 characters.",
  "auth/too-many-requests":
    "Too many attempts. Wait a minute, then try again.",
  "auth/network-request-failed":
    "Could not reach the server. Check your connection and retry.",
  "auth/user-disabled": "This account has been disabled.",
};

export function authErrorMessage(error: unknown): string {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code: unknown }).code)
      : "";

  return MESSAGES[code] ?? "Something went wrong. Please try again.";
}

/** Which field an error belongs next to, so it renders inline. */
export function authErrorField(
  error: unknown,
): "email" | "password" | "form" {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code: unknown }).code)
      : "";

  if (code === "auth/invalid-email" || code === "auth/email-already-in-use")
    return "email";
  if (code === "auth/user-not-found") return "email";
  if (code === "auth/wrong-password" || code === "auth/weak-password")
    return "password";
  return "form";
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
