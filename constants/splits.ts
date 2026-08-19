import type { PlannedDay, WeekPlan, WorkoutDaysAnswer } from "@/types/workout";

/**
 * Maps the onboarding "days per week" answer onto a training split.
 *
 * `title` values are also written into every workout log as `dayName`, and the
 * progress screen groups logs by that string. Renaming one here orphans every
 * log recorded under the old name, so treat these as fixed.
 */
export type SplitDefinition = {
  name: string;
  description: string;
  /** Ordered, so the home screen renders days in the order they are trained. */
  days: { key: string; title: string }[];
};

export const SPLITS: Record<WorkoutDaysAnswer, SplitDefinition> = {
  "2": {
    name: "Full Body",
    description: "Two full-body sessions a week",
    days: [
      { key: "dayA", title: "Full Body Day A" },
      { key: "dayB", title: "Full Body Day B" },
    ],
  },
  "3-4": {
    name: "Upper / Lower",
    description: "Alternating upper and lower body",
    days: [
      { key: "upperA", title: "Upper A" },
      { key: "lowerA", title: "Lower A" },
      { key: "upperB", title: "Upper B" },
      { key: "lowerB", title: "Lower B" },
    ],
  },
  "4": {
    name: "Push Pull Legs",
    description: "Six sessions across a two-week rotation",
    days: [
      { key: "pushA", title: "Push A" },
      { key: "pullA", title: "Pull A" },
      { key: "legsA", title: "Legs A" },
      { key: "pushB", title: "Push B" },
      { key: "pullB", title: "Pull B" },
      { key: "legsB", title: "Legs B" },
    ],
  },
};

/** Every title the app has ever written, for grouping historical logs. */
export const ALL_DAY_TITLES = Object.values(SPLITS).flatMap((split) =>
  split.days.map((day) => day.title),
);

export function getSplit(days: string | undefined): SplitDefinition | null {
  if (!days) return null;
  return SPLITS[days as WorkoutDaysAnswer] ?? null;
}

/**
 * Turns a stored week (an object keyed by day) into the ordered list the UI
 * renders. Days missing from an older stored document are skipped rather than
 * rendering an empty card.
 */
export function toDayList(
  week: WeekPlan | undefined,
  days: string | undefined,
): PlannedDay[] {
  const split = getSplit(days);
  if (!split || !week) return [];

  return split.days
    .map(({ key, title }) => ({
      key,
      title,
      exercises: (week[key] ?? []).filter((e) => e && e.name),
    }))
    .filter((day) => day.exercises.length > 0);
}
