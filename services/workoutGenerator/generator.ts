import { collection, getDocs } from "firebase/firestore";

import { db } from "@/firebase/config";
import type { Exercise, WeekPlan, WorkoutDaysAnswer } from "@/types/workout";
import { getOnboardingData } from "@/utils/fetchData";
import { buildWeek, templatesFor } from "./planBuilder";

export { buildWeek, generateDay, templatesFor } from "./planBuilder";

export async function fetchExercises(): Promise<Exercise[]> {
  const snapshot = await getDocs(collection(db, "exercises"));
  return snapshot.docs.map((doc) => doc.data() as Exercise);
}

/**
 * Generates both weeks in one pass.
 *
 * The exercise collection and the user document are read once and shared. The
 * previous version called `generateWorkout()` twice, and each call re-read the
 * whole collection, so a single plan cost four network round trips.
 */
export async function generateBothWeeks(): Promise<{
  weekA: WeekPlan;
  weekB: WeekPlan;
  workoutDays: WorkoutDaysAnswer;
}> {
  const [{ workoutDays, sessionLength }, exercises] = await Promise.all([
    getOnboardingData(),
    fetchExercises(),
  ]);

  if (!templatesFor(workoutDays, sessionLength)) {
    throw new Error(
      `No template for ${workoutDays} days at ${sessionLength} minutes`,
    );
  }

  return {
    weekA: buildWeek(exercises, workoutDays, sessionLength, "A"),
    weekB: buildWeek(exercises, workoutDays, sessionLength, "B"),
    workoutDays,
  };
}
