import { doc, getDoc, setDoc } from "firebase/firestore";

import { auth, db } from "@/firebase/config";
import {
  demoProfileData,
  demoWorkoutPlan,
  isDemo,
} from "@/services/demo/demoMode";
import type { StoredWorkout, WeekPlan, WorkoutDaysAnswer } from "@/types/workout";
import { generateBothWeeks } from "./generator";

function requireUid(): string {
  const user = auth.currentUser;
  if (!user) throw new Error("You need to be signed in to do that.");
  return user.uid;
}

const workoutDoc = (uid: string) =>
  doc(db, "users", uid, "workout", "current");

/** Generates a fresh plan and overwrites the stored one. */
export async function saveWorkout(): Promise<StoredWorkout> {
  if (isDemo()) return demoWorkoutPlan();

  const uid = requireUid();
  const { weekA, weekB } = await generateBothWeeks();

  await setDoc(workoutDoc(uid), {
    weekA,
    weekB,
    generatedAt: new Date().toISOString(),
  });

  return { weekA, weekB };
}

export type CurrentWorkout = {
  weekA: WeekPlan;
  weekB: WeekPlan;
  workoutDays: WorkoutDaysAnswer;
};

/**
 * Reads the stored plan, generating one on first run.
 *
 * The previous version tested `snapshot.exists` instead of calling it. In the
 * modular SDK that is a function reference, so the guard was always truthy and
 * a missing document fell through to a crash on `.data()`.
 */
export async function loadCurrentWorkout(): Promise<CurrentWorkout> {
  if (isDemo()) {
    return {
      ...demoWorkoutPlan(),
      workoutDays: demoProfileData().onboarding.workoutDays,
    };
  }

  const uid = requireUid();

  const [workoutSnap, userSnap] = await Promise.all([
    getDoc(workoutDoc(uid)),
    getDoc(doc(db, "users", uid)),
  ]);

  const user = userSnap.data();
  if (!user?.onboarding) {
    throw new Error("Finish onboarding before loading a plan.");
  }
  const workoutDays = user.onboarding.workoutDays as WorkoutDaysAnswer;

  if (!workoutSnap.exists()) {
    const generated = await saveWorkout();
    return { ...generated, workoutDays };
  }

  const stored = workoutSnap.data() as StoredWorkout;
  return { weekA: stored.weekA ?? {}, weekB: stored.weekB ?? {}, workoutDays };
}
