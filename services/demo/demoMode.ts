import { Platform } from "react-native";

import type { WorkoutLog } from "@/types/workout";
import { demoLogs, demoPlan, demoProfile } from "./demoData";

/**
 * Demo mode.
 *
 * Swaps every Firestore read for local fixtures and turns every write into an
 * in-memory mutation, so the hosted demo needs no backend, exposes no
 * credentials, and cannot be vandalised by one visitor for the next.
 *
 * State lives for the life of the page. A refresh puts it back to the seeded
 * fixtures, which is the behaviour a public demo wants.
 */

type Listener = () => void;

const listeners = new Set<Listener>();

/**
 * Lets the hosted build deep link into the demo with `?demo=1`, on any route
 * rather than only the welcome screen.
 */
function demoRequestedByUrl(): boolean {
  if (Platform.OS !== "web") return false;
  try {
    return new URLSearchParams(window.location.search).has("demo");
  } catch {
    return false;
  }
}

// Read at module load, before the first screen mounts, so a deep link is
// already in demo mode by the time the auth guard evaluates it.
let active = demoRequestedByUrl();

/** Writes made during the session, newest appended. */
let sessionLogs: WorkoutLog[] = [];
let displayName = demoProfile().username;

function notify() {
  for (const listener of listeners) listener();
}

export function isDemo(): boolean {
  return active;
}

export function enableDemo() {
  if (active) return;
  active = true;
  sessionLogs = [];
  displayName = demoProfile().username;
  notify();
}

export function exitDemo() {
  if (!active) return;
  active = false;
  sessionLogs = [];
  notify();
}

export function subscribeToDemo(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/* --------------------------- fixture access --------------------------- */

export function demoUser() {
  return {
    uid: "demo-user",
    email: "demo@mfit.app",
    displayName,
  };
}

export function demoUsername(): string {
  return displayName;
}

export function setDemoUsername(next: string) {
  displayName = next;
  notify();
}

export function demoWorkoutPlan() {
  return demoPlan();
}

export function demoProfileData() {
  return { ...demoProfile(), username: displayName };
}

/** Seeded history plus anything logged during this visit, oldest first. */
export function demoWorkoutLogs(maxLogs = 200): WorkoutLog[] {
  const all = [...demoLogs(), ...sessionLogs];
  return all.slice(Math.max(0, all.length - maxLogs));
}

export function appendDemoLog(log: Omit<WorkoutLog, "id">) {
  sessionLogs.push({ ...log, id: `demo-session-${sessionLogs.length}` });
  notify();
}

export function demoLogCount(): number {
  return demoLogs().length + sessionLogs.length;
}
