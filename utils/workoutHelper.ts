import type { SessionLengthAnswer } from "@/types/workout";

/**
 * How many exercises may share one piece of equipment in a single session.
 *
 * Short sessions want variety across stations so nothing is blocked; long
 * sessions can afford to camp on a rack.
 */
const EQUIPMENT_ALLOWANCE: Record<SessionLengthAnswer, number> = {
  "30": 1,
  "30-60": 2,
  "60+": 3,
};

export function equipmentAllowance(sessionLength: string): number {
  return EQUIPMENT_ALLOWANCE[sessionLength as SessionLengthAnswer] ?? 2;
}

/** True when `equipmentType` is already used up to its allowance. */
export function isEquipmentSaturated(
  equipmentType: string,
  used: string[],
  allowance: number,
): boolean {
  let count = 0;
  for (const entry of used) {
    if (entry === equipmentType) count += 1;
  }
  return count >= allowance;
}

export function isExerciseUsed(name: string, used: string[]): boolean {
  return used.includes(name);
}

/**
 * Rep range by exercise role. Compounds sit lower for load, isolations higher
 * for volume. Persisted with the plan so the numbers survive a rules change.
 */
export function repRangeFor(compoundIsolation: string): string {
  return compoundIsolation === "Compound" ? "6-10" : "10-15";
}
