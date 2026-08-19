/** Shapes stored in Firestore and passed between screens. */

export type WorkoutDaysAnswer = "2" | "3-4" | "4";
export type SessionLengthAnswer = "30" | "30-60" | "60+";
export type GoalAnswer = "wl" | "maintain" | "gain";
export type GenderAnswer = "male" | "female";

/** A row from the `exercises` collection. */
export type Exercise = {
  name: string;
  primaryMuscle: string;
  secondaryMuscle?: string;
  tertiaryMuscle?: string;
  /** Equipment: Barbell, Dumbbell, Machine, Cable, Bodyweight, Band. */
  type: string;
  strengthHypertrophy?: string;
  compoundIsolation: "Compound" | "Isolation";
};

/** An exercise once the generator has assigned volume to it. */
export type PlannedExercise = Exercise & {
  sets: number;
  /** Display range such as "6-10". Persisted so it survives a rules change. */
  repRange: string;
};

/** One training day of a generated week. */
export type PlannedDay = {
  /** Stable key inside the stored week object, e.g. "upperA". */
  key: string;
  /**
   * Human label. Also written to every log as `dayName`, so changing an existing
   * title breaks progress comparisons against older logs.
   */
  title: string;
  exercises: PlannedExercise[];
};

/** What the generator returns and what Firestore stores per week. */
export type WeekPlan = Record<string, PlannedExercise[]>;

export type StoredWorkout = {
  weekA: WeekPlan;
  weekB: WeekPlan;
};

export type WeekLabel = "A" | "B";

/* ---------------------------- logging ---------------------------- */

export type LoggedSet = {
  weight: number;
  reps: number;
  /** Marks the set as a personal best at the time it was logged. */
  isPr?: boolean;
};

export type LoggedExercise = {
  exerciseIndex: number;
  exerciseName: string;
  primaryMuscleGroup: string;
  sets: LoggedSet[];
};

export type WorkoutLog = {
  id: string;
  dayName: string;
  date: string;
  /** Seconds. */
  duration: number;
  workout: LoggedExercise[];
};

/* --------------------------- onboarding -------------------------- */

export type OnboardingData = {
  goal: GoalAnswer;
  gender: GenderAnswer;
  age: number;
  height: number;
  weight: number;
  workoutDays: WorkoutDaysAnswer;
  sessionLength: SessionLengthAnswer;
  completedAt: string;
};
