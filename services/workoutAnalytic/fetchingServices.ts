import {
  collection,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";

import { auth, db } from "@/firebase/config";
import type { LoggedExercise, WorkoutLog } from "@/types/workout";

function requireUid(): string {
  const user = auth.currentUser;
  if (!user) throw new Error("You need to be signed in to do that.");
  return user.uid;
}

/** Older logs stored weights and reps as strings. Normalise on read. */
function normaliseLog(id: string, raw: Record<string, unknown>): WorkoutLog {
  const exercises = Array.isArray(raw.workout) ? raw.workout : [];

  return {
    id,
    dayName: typeof raw.dayName === "string" ? raw.dayName : "Workout",
    date: typeof raw.date === "string" ? raw.date : new Date(0).toISOString(),
    duration: Number(raw.duration) || 0,
    workout: exercises
      .filter(Boolean)
      .map((entry: any, index: number): LoggedExercise => ({
        exerciseIndex: Number(entry.exerciseIndex ?? index),
        exerciseName: String(entry.exerciseName ?? "Exercise"),
        primaryMuscleGroup: String(entry.primaryMuscleGroup ?? "Other"),
        sets: (Array.isArray(entry.sets) ? entry.sets : [])
          .map((set: any) => ({
            weight: Number(set?.weight) || 0,
            reps: Number(set?.reps) || 0,
            isPr: Boolean(set?.isPr),
          }))
          .filter((set: { weight: number; reps: number }) => set.reps > 0),
      })),
  };
}

/**
 * The most recent `maxLogs` workouts, returned oldest first.
 *
 * The query orders descending so the cap keeps the newest sessions, then the
 * result is reversed because the progress maths wants chronological order.
 * Ordering ascending and capping would have returned the oldest N instead,
 * which would pin "last session" to an old workout once an account passed the
 * limit.
 */
export async function fetchPastWorkouts(maxLogs = 200): Promise<WorkoutLog[]> {
  const uid = requireUid();

  const logs = await getDocs(
    query(
      collection(db, "users", uid, "logs"),
      orderBy("date", "desc"),
      limit(maxLogs),
    ),
  );

  return logs.docs
    .map((entry) => normaliseLog(entry.id, entry.data()))
    .reverse();
}

/** Server-side count, so it stays cheap as the log collection grows. */
export async function fetchLogCount(): Promise<number> {
  const uid = requireUid();
  const snapshot = await getCountFromServer(
    collection(db, "users", uid, "logs"),
  );
  return snapshot.data().count;
}
