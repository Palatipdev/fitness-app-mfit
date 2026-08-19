import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "@/firebase/config";
import type { OnboardingData, WeekLabel } from "@/types/workout";

const WEEK_MS = 604_800_000;

function requireUid(): string {
  const user = auth.currentUser;
  if (!user) throw new Error("You need to be signed in to do that.");
  return user.uid;
}

/**
 * Reads the whole user document once. The previous version exported three
 * functions that each re-fetched the same document.
 */
export async function getUserProfile(): Promise<{
  username: string;
  onboarding: OnboardingData;
}> {
  const uid = requireUid();
  const snapshot = await getDoc(doc(db, "users", uid));

  if (!snapshot.exists()) throw new Error("Your profile could not be found.");
  const data = snapshot.data();
  if (!data.onboarding) throw new Error("Onboarding is not finished yet.");

  return {
    username: typeof data.username === "string" ? data.username : "",
    onboarding: data.onboarding as OnboardingData,
  };
}

export async function getOnboardingData(): Promise<OnboardingData> {
  return (await getUserProfile()).onboarding;
}

/**
 * Which half of the A/B rotation the user is in, derived from how many whole
 * weeks have passed since onboarding.
 */
export function weekLabelFor(
  completedAt: string,
  now: number = Date.now(),
): WeekLabel {
  const start = new Date(completedAt).getTime();
  if (Number.isNaN(start)) return "A";
  const weeksElapsed = Math.trunc((now - start) / WEEK_MS);
  return weeksElapsed % 2 === 1 ? "B" : "A";
}

export async function getWeek(): Promise<WeekLabel> {
  const { onboarding } = await getUserProfile();
  return weekLabelFor(onboarding.completedAt);
}
