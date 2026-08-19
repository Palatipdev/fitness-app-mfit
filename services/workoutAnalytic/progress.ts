import { ALL_DAY_TITLES } from "@/constants/splits";
import type { LoggedSet, WorkoutLog } from "@/types/workout";

export type TopSet = {
  exerciseName: string;
  primaryMuscleGroup: string;
  weight: number;
  reps: number;
  /** Estimated one-rep max for this set. */
  estimated1RM: number;
};

export type MuscleProgress = {
  muscle: string;
  /** Percent change between the first and most recent comparable session. */
  change: number;
};

export type ProgressSummary = {
  totalWorkouts: number;
  totalSets: number;
  /** Total weight moved, in whatever unit the user logged. */
  totalVolume: number;
  /** Seconds. */
  totalDuration: number;
  currentStreakWeeks: number;
  muscleProgress: MuscleProgress[];
};

/**
 * Epley formula. Accurate enough under about 12 reps, which covers the rep
 * ranges the generator prescribes.
 */
export function estimate1RM(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) return 0;
  return weight * (1 + reps / 30);
}

/** The single best set of an exercise, ranked by estimated 1RM. */
function bestSet(sets: LoggedSet[]): LoggedSet | null {
  let best: LoggedSet | null = null;
  let bestScore = 0;

  for (const set of sets) {
    const score = estimate1RM(set.weight, set.reps);
    if (score > bestScore) {
      bestScore = score;
      best = set;
    }
  }
  return best;
}

/** Heaviest working set per exercise in one logged session. */
export function topSetsFor(log: WorkoutLog): TopSet[] {
  const results: TopSet[] = [];

  for (const exercise of log.workout) {
    const best = bestSet(exercise.sets);
    if (!best) continue;
    results.push({
      exerciseName: exercise.exerciseName,
      primaryMuscleGroup: exercise.primaryMuscleGroup,
      weight: best.weight,
      reps: best.reps,
      estimated1RM: estimate1RM(best.weight, best.reps),
    });
  }

  return results;
}

/** Summed estimated 1RM per muscle group for one session. */
function muscleStrength(log: WorkoutLog): Record<string, number> {
  const totals: Record<string, number> = {};

  for (const set of topSetsFor(log)) {
    totals[set.primaryMuscleGroup] =
      (totals[set.primaryMuscleGroup] ?? 0) + set.estimated1RM;
  }
  return totals;
}

/**
 * Percent strength change per muscle group.
 *
 * Sessions are grouped by `dayName` first, because comparing a Push day against
 * a Leg day would measure the split, not progress. A group needs at least two
 * sessions before it contributes.
 */
export function calculateMuscleProgress(logs: WorkoutLog[]): MuscleProgress[] {
  const accumulated: Record<string, { sum: number; count: number }> = {};

  for (const title of ALL_DAY_TITLES) {
    const sessions = logs.filter((log) => log.dayName === title);
    if (sessions.length < 2) continue;

    const first = muscleStrength(sessions[0]);
    const latest = muscleStrength(sessions[sessions.length - 1]);

    for (const [muscle, current] of Object.entries(latest)) {
      const baseline = first[muscle];
      if (!baseline) continue;

      const change = ((current - baseline) / baseline) * 100;
      const bucket = accumulated[muscle] ?? { sum: 0, count: 0 };
      bucket.sum += change;
      bucket.count += 1;
      accumulated[muscle] = bucket;
    }
  }

  return Object.entries(accumulated)
    .map(([muscle, { sum, count }]) => ({
      muscle,
      change: Math.round((sum / count) * 10) / 10,
    }))
    .sort((a, b) => b.change - a.change);
}

/** Consecutive calendar weeks, counting back from the most recent log. */
function streakInWeeks(logs: WorkoutLog[]): number {
  if (logs.length === 0) return 0;

  const WEEK = 604_800_000;
  const weekOf = (iso: string) => Math.floor(new Date(iso).getTime() / WEEK);

  const weeks = [...new Set(logs.map((log) => weekOf(log.date)))].sort(
    (a, b) => b - a,
  );

  let streak = 1;
  for (let i = 1; i < weeks.length; i += 1) {
    if (weeks[i - 1] - weeks[i] !== 1) break;
    streak += 1;
  }
  return streak;
}

/** Everything the progress screen shows, computed in one pass. */
export function summarise(logs: WorkoutLog[]): ProgressSummary {
  let totalSets = 0;
  let totalVolume = 0;
  let totalDuration = 0;

  for (const log of logs) {
    totalDuration += log.duration;
    for (const exercise of log.workout) {
      for (const set of exercise.sets) {
        totalSets += 1;
        totalVolume += set.weight * set.reps;
      }
    }
  }

  return {
    totalWorkouts: logs.length,
    totalSets,
    totalVolume,
    totalDuration,
    currentStreakWeeks: streakInWeeks(logs),
    muscleProgress: calculateMuscleProgress(logs),
  };
}

/**
 * Best estimated 1RM per exercise across all history, used to flag a new set
 * as a personal record while the user is logging.
 */
export function personalBests(logs: WorkoutLog[]): Record<string, number> {
  const bests: Record<string, number> = {};

  for (const log of logs) {
    for (const set of topSetsFor(log)) {
      const current = bests[set.exerciseName] ?? 0;
      if (set.estimated1RM > current) bests[set.exerciseName] = set.estimated1RM;
    }
  }
  return bests;
}
