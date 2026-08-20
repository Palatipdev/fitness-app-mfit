import exerciseData from "@/exercises.json";
import { SPLITS } from "@/constants/splits";
import { buildWeek } from "@/services/workoutGenerator/planBuilder";
import type {
  Exercise,
  LoggedExercise,
  OnboardingData,
  PlannedExercise,
  StoredWorkout,
  WorkoutLog,
} from "@/types/workout";

/**
 * Fixtures for the public demo.
 *
 * The plan is produced by the real generator against the bundled exercise list,
 * so the demo shows genuine output rather than a mocked-up screenshot. History
 * is synthesised on top of that plan with a seeded generator, so every visitor
 * sees the same numbers and the progress charts stay reproducible.
 */

const WEEKS_OF_HISTORY = 12;
const DEMO_SPLIT: keyof typeof SPLITS = "3-4";
const DEMO_SESSION = "30-60" as const;
const WEEK_MS = 604_800_000;
const DAY_MS = 86_400_000;

/** mulberry32. Small, fast, and stable across platforms. */
function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Stable per-exercise seed, so the same movement always starts at the same load. */
function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** A plausible starting weight in lb for a given movement. */
function baseWeight(exercise: PlannedExercise): number {
  const rand = seeded(hash(exercise.name));
  const compound = exercise.compoundIsolation === "Compound";

  const anchor = compound ? 115 : 40;
  const spread = compound ? 70 : 30;
  const raw = anchor + rand() * spread;

  // Round to something you could actually load on a bar or a stack.
  return Math.round(raw / 5) * 5;
}

let cachedPlan: StoredWorkout | null = null;

export function demoPlan(): StoredWorkout {
  if (cachedPlan) return cachedPlan;

  const exercises = exerciseData as Exercise[];
  cachedPlan = {
    weekA: buildWeek(exercises, DEMO_SPLIT, DEMO_SESSION, "A"),
    weekB: buildWeek(exercises, DEMO_SPLIT, DEMO_SESSION, "B"),
  };
  return cachedPlan;
}

export function demoProfile(): { username: string; onboarding: OnboardingData } {
  return {
    username: "Palatip Boonmeerit",
    onboarding: {
      goal: "gain",
      gender: "male",
      age: 26,
      height: 178,
      weight: 172,
      workoutDays: DEMO_SPLIT,
      sessionLength: DEMO_SESSION,
      // Backdated so the A/B rotation and the streak counter have something
      // to work with the moment the demo opens.
      completedAt: new Date(
        Date.now() - WEEKS_OF_HISTORY * WEEK_MS,
      ).toISOString(),
    },
  };
}

function logExercises(
  planned: PlannedExercise[],
  weekIndex: number,
  rand: () => number,
): LoggedExercise[] {
  return planned.map((exercise, exerciseIndex) => {
    const start = baseWeight(exercise);

    // Roughly 1.4% a week, which lands a 115lb start near 135 after 12 weeks.
    const trend = start * (1 + 0.014 * weekIndex);
    // A little noise so the lines are not suspiciously straight.
    const noise = (rand() - 0.5) * start * 0.05;
    const working = Math.max(5, Math.round((trend + noise) / 5) * 5);

    const targetReps = exercise.compoundIsolation === "Compound" ? 8 : 12;

    return {
      exerciseIndex,
      exerciseName: exercise.name,
      primaryMuscleGroup: exercise.primaryMuscle,
      sets: Array.from({ length: exercise.sets }, (_, setIndex) => ({
        // Reps drift down across the sets, the way they actually do.
        reps: Math.max(4, targetReps - setIndex - (rand() < 0.3 ? 1 : 0)),
        weight: working,
        isPr: false,
      })),
    };
  });
}

let cachedLogs: WorkoutLog[] | null = null;

/** Twelve weeks of sessions, oldest first, matching `fetchPastWorkouts`. */
export function demoLogs(): WorkoutLog[] {
  if (cachedLogs) return cachedLogs;

  const plan = demoPlan();
  const days = SPLITS[DEMO_SPLIT].days;
  const rand = seeded(20260820);
  const logs: WorkoutLog[] = [];
  const now = Date.now();

  for (let week = 0; week < WEEKS_OF_HISTORY; week += 1) {
    const weekPlan = week % 2 === 0 ? plan.weekA : plan.weekB;
    const weeksAgo = WEEKS_OF_HISTORY - 1 - week;

    days.forEach((day, dayIndex) => {
      const planned = weekPlan[day.key] ?? [];
      if (planned.length === 0) return;

      // Train Mon/Tue/Thu/Fri rather than four days in a row.
      const offsetDays = [0, 1, 3, 4][dayIndex] ?? dayIndex;
      const date = new Date(
        now - weeksAgo * WEEK_MS + offsetDays * DAY_MS - 6 * 3600_000,
      );

      // The most recent week is only partly done, so "up next" has somewhere
      // to point and the home screen does not look finished.
      if (date.getTime() > now) return;

      logs.push({
        id: `demo-${week}-${day.key}`,
        dayName: day.title,
        date: date.toISOString(),
        duration: 2700 + Math.round(rand() * 1500),
        workout: logExercises(planned, week, rand),
      });
    });
  }

  cachedLogs = logs.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  return cachedLogs;
}
