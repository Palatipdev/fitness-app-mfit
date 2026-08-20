import type {
  Exercise,
  PlannedExercise,
  SessionLengthAnswer,
  WeekLabel,
  WeekPlan,
  WorkoutDaysAnswer,
} from "@/types/workout";
import {
  equipmentAllowance,
  isEquipmentSaturated,
  isExerciseUsed,
  repRangeFor,
} from "@/utils/workoutHelper";
import {
  FULL_BODY_TEMPLATES,
  PPL_TEMPLATES,
  UPPER_LOWER_TEMPLATES,
} from "@/utils/workoutTemplate";

/**
 * Plan building, with no Firebase in the import graph.
 *
 * Kept separate from generator.ts so the onboarding preview and the demo
 * fixtures can build a real plan without pulling in the Firestore client.
 */

type TemplateSlot = {
  muscle: string;
  ci: "Compound" | "Isolation";
  sets: number;
  weekDependent?: boolean;
};

/** Muscles whose target alternates between week A and week B. */
const WEEK_DEPENDENT: Record<string, [string, string]> = {
  legIsolation: ["Quads", "Hamstrings"],
  legIsolationA: ["Quads", "Hamstrings"],
  legIsolationB: ["Hamstrings", "Quads"],
  thighIsolation: ["Inner Thigh", "Outer Thigh"],
};

function resolveMuscle(slot: TemplateSlot, week: WeekLabel): string {
  if (!slot.weekDependent) return slot.muscle;
  const pair = WEEK_DEPENDENT[slot.muscle];
  if (!pair) return slot.muscle;
  return week === "A" ? pair[0] : pair[1];
}

/**
 * Builds one training day.
 *
 * Picks a random candidate per slot, then re-rolls while it duplicates an
 * exercise already chosen or over-uses one piece of equipment. The previous
 * version passed whole exercise objects into helpers that compared strings, so
 * every check silently returned false and no de-duplication ever happened. It
 * also never incremented its attempt counter.
 */
export function generateDay(
  week: WeekLabel,
  template: TemplateSlot[],
  exercises: Exercise[],
  allowance: number,
): PlannedExercise[] {
  const usedEquipment: string[] = [];
  const usedNames: string[] = [];
  const day: PlannedExercise[] = [];
  const MAX_ATTEMPTS = 24;

  for (const slot of template) {
    const targetMuscle = resolveMuscle(slot, week);

    const candidates = exercises.filter(
      (exercise) =>
        exercise.primaryMuscle === targetMuscle &&
        exercise.compoundIsolation === slot.ci &&
        exercise.type !== "Bodyweight" &&
        exercise.type !== "Band",
    );

    // No candidate means the exercise database has a gap for this muscle and
    // role. Skip the slot rather than pushing an undefined row into the plan.
    if (candidates.length === 0) continue;

    let pick = candidates[Math.floor(Math.random() * candidates.length)];
    let attempts = 0;

    while (
      attempts < MAX_ATTEMPTS &&
      (isExerciseUsed(pick.name, usedNames) ||
        isEquipmentSaturated(pick.type, usedEquipment, allowance))
    ) {
      pick = candidates[Math.floor(Math.random() * candidates.length)];
      attempts += 1;
    }

    // A duplicate that survives the retry budget is better than a missing slot,
    // so the last pick is kept either way.
    usedEquipment.push(pick.type);
    usedNames.push(pick.name);
    day.push({
      ...pick,
      sets: slot.sets,
      repRange: repRangeFor(pick.compoundIsolation),
    });
  }

  return day;
}

export function templatesFor(
  workoutDays: WorkoutDaysAnswer,
  sessionLength: SessionLengthAnswer,
): Record<string, TemplateSlot[]> {
  const source =
    workoutDays === "2"
      ? FULL_BODY_TEMPLATES
      : workoutDays === "3-4"
        ? UPPER_LOWER_TEMPLATES
        : PPL_TEMPLATES;

  return (source as Record<string, Record<string, TemplateSlot[]>>)[
    sessionLength
  ];
}

/**
 * Builds one week from explicit inputs, with no Firestore involved.
 *
 * The onboarding preview uses this against the bundled exercise list so it can
 * show a real plan before an account exists.
 */
export function buildWeek(
  exercises: Exercise[],
  workoutDays: WorkoutDaysAnswer,
  sessionLength: SessionLengthAnswer,
  week: WeekLabel,
): WeekPlan {
  const templates = templatesFor(workoutDays, sessionLength);
  if (!templates) return {};

  const allowance = equipmentAllowance(sessionLength);
  const plan: WeekPlan = {};

  for (const [dayKey, slots] of Object.entries(templates)) {
    plan[dayKey] = generateDay(week, slots, exercises, allowance);
  }
  return plan;
}
