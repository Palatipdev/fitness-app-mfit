import Feather from "@expo/vector-icons/Feather";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";

import {
  ExerciseLogCard,
  type DraftExercise,
  type DraftSet,
} from "@/components/logging/ExerciseLogCard";
import { RestTimer } from "@/components/logging/RestTimer";
import {
  WorkoutTimer,
  elapsedSeconds,
} from "@/components/logging/WorkoutTimer";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { auth, db } from "@/firebase/config";
import { useTheme } from "@/hooks/useTheme";
import { fetchPastWorkouts } from "@/services/workoutAnalytic/fetchingServices";
import {
  estimate1RM,
  personalBests,
  topSetsFor,
} from "@/services/workoutAnalytic/progress";
import type { PlannedExercise, WorkoutLog } from "@/types/workout";

const DEFAULT_REST = 90;

let setCounter = 0;
const newSetId = () => `s${(setCounter += 1)}`;

function blankSet(): DraftSet {
  return { id: newSetId(), weight: "", reps: "", done: false, isPr: false };
}

function toDraft(exercises: PlannedExercise[]): DraftExercise[] {
  return exercises.map((exercise) => ({
    name: exercise.name,
    primaryMuscle: exercise.primaryMuscle,
    repRange: exercise.repRange ?? "8-12",
    targetSets: exercise.sets ?? 3,
    // Rows are laid out up front so the table shows the prescribed volume.
    sets: Array.from({ length: Math.max(1, exercise.sets ?? 3) }, blankSet),
  }));
}

export default function WorkoutLogging() {
  const t = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();

  const dayName = (params.dayName as string) ?? "Workout";

  const startedAt = useRef(Date.now()).current;
  const [exercises, setExercises] = useState<DraftExercise[]>(() => {
    try {
      return toDraft(JSON.parse((params.exercises as string) ?? "[]"));
    } catch {
      return [];
    }
  });

  const [bests, setBests] = useState<Record<string, number>>({});
  const [previous, setPrevious] = useState<
    Record<string, { weight: number; reps: number }>
  >({});
  const [saving, setSaving] = useState(false);
  const [restStartedAt, setRestStartedAt] = useState<number | null>(null);
  const [restDuration, setRestDuration] = useState(DEFAULT_REST);

  /* ----------------------------- history ---------------------------- */

  useEffect(() => {
    let cancelled = false;

    fetchPastWorkouts(60)
      .then((logs: WorkoutLog[]) => {
        if (cancelled) return;
        setBests(personalBests(logs));

        // Most recent top set per exercise, shown in the "Prev" column.
        const seen: Record<string, { weight: number; reps: number }> = {};
        for (const log of logs) {
          for (const set of topSetsFor(log)) {
            seen[set.exerciseName] = { weight: set.weight, reps: set.reps };
          }
        }
        setPrevious(seen);
      })
      .catch(() => {
        // History is an enhancement here; logging still works without it.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /* --------------------------- set editing -------------------------- */

  const completedSets = useMemo(
    () =>
      exercises.reduce(
        (sum, exercise) => sum + exercise.sets.filter((s) => s.done).length,
        0,
      ),
    [exercises],
  );

  const updateExercise = useCallback(
    (index: number, update: (exercise: DraftExercise) => DraftExercise) => {
      // Every level that changes is copied. The previous version spread the
      // outer array but then pushed into the nested `sets` array in place, so
      // React saw the same reference and could skip the re-render.
      setExercises((current) =>
        current.map((exercise, i) => (i === index ? update(exercise) : exercise)),
      );
    },
    [],
  );

  const handleChangeSet = useCallback(
    (
      index: number,
      setId: string,
      patch: Partial<Pick<DraftSet, "weight" | "reps">>,
    ) => {
      updateExercise(index, (exercise) => ({
        ...exercise,
        sets: exercise.sets.map((set) =>
          set.id === setId ? { ...set, ...patch } : set,
        ),
      }));
    },
    [updateExercise],
  );

  const handleToggleSet = useCallback(
    (index: number, setId: string) => {
      let startedRest = false;

      setExercises((current) =>
        current.map((exercise, i) => {
          if (i !== index) return exercise;

          return {
            ...exercise,
            sets: exercise.sets.map((set) => {
              if (set.id !== setId) return set;

              const weight = Number(set.weight);
              const reps = Number(set.reps);
              const nextDone = !set.done;

              if (nextDone && reps > 0) startedRest = true;

              return {
                ...set,
                done: nextDone,
                isPr:
                  nextDone &&
                  reps > 0 &&
                  estimate1RM(weight, reps) > (bests[exercise.name] ?? 0),
              };
            }),
          };
        }),
      );

      if (startedRest) setRestStartedAt(Date.now());
    },
    [bests],
  );

  const handleAddSet = useCallback(
    (index: number) => {
      updateExercise(index, (exercise) => ({
        ...exercise,
        sets: [...exercise.sets, blankSet()],
      }));
    },
    [updateExercise],
  );

  const handleRemoveSet = useCallback(
    (index: number, setId: string) => {
      updateExercise(index, (exercise) =>
        exercise.sets.length <= 1
          ? exercise
          : {
              ...exercise,
              sets: exercise.sets.filter((set) => set.id !== setId),
            },
      );
    },
    [updateExercise],
  );

  /* ------------------------------ saving ---------------------------- */

  const finish = useCallback(async () => {
    const logged = exercises
      .map((exercise, index) => ({
        exerciseIndex: index,
        exerciseName: exercise.name,
        primaryMuscleGroup: exercise.primaryMuscle,
        sets: exercise.sets
          .filter((set) => set.done && Number(set.reps) > 0)
          .map((set) => ({
            weight: Number(set.weight) || 0,
            reps: Number(set.reps),
            isPr: set.isPr,
          })),
      }))
      .filter((exercise) => exercise.sets.length > 0);

    if (logged.length === 0) {
      Alert.alert(
        "Nothing logged yet",
        "Check off at least one set before finishing.",
        [{ text: "Keep going" }],
      );
      return;
    }

    setSaving(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("You are no longer signed in.");

      const date = new Date().toISOString();
      await setDoc(doc(db, "users", user.uid, "logs", date), {
        workout: logged,
        duration: elapsedSeconds(startedAt),
        dayName,
        date,
      });

      router.replace("/homepage");
    } catch (error) {
      setSaving(false);
      Alert.alert(
        "Could not save",
        error instanceof Error
          ? error.message
          : "Check your connection and try again.",
        [{ text: "OK" }],
      );
    }
  }, [exercises, dayName, startedAt, router]);

  const confirmDiscard = useCallback(() => {
    if (completedSets === 0) {
      router.back();
      return true;
    }

    Alert.alert(
      "Discard this workout?",
      `${completedSets} logged ${completedSets === 1 ? "set" : "sets"} will be lost.`,
      [
        { text: "Keep logging", style: "cancel" },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => router.back(),
        },
      ],
    );
    return true;
  }, [completedSets, router]);

  // Android back must not silently drop a session in progress.
  useEffect(() => {
    const sub = BackHandler.addEventListener(
      "hardwareBackPress",
      confirmDiscard,
    );
    return () => sub.remove();
  }, [confirmDiscard]);

  /* ------------------------------ render ---------------------------- */

  return (
    <Screen edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: t.space.md,
            paddingHorizontal: t.space.lg,
            paddingBottom: t.space.md,
            borderBottomWidth: 1,
            borderBottomColor: t.colors.border,
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Discard workout"
            hitSlop={12}
            onPress={confirmDiscard}
            style={{ height: t.hitTarget, justifyContent: "center" }}
          >
            <Feather name="x" size={22} color={t.colors.textMuted} />
          </Pressable>

          <View style={{ flex: 1 }}>
            <Text variant="title" numberOfLines={1}>
              {dayName}
            </Text>
            <WorkoutTimer startedAt={startedAt} />
          </View>

          <Button
            label="Finish"
            size="sm"
            loading={saving}
            onPress={finish}
            accessibilityHint="Saves this session and returns home"
          />
        </View>

        <ScrollView
          contentContainerStyle={{
            padding: t.space.lg,
            paddingBottom: t.space.xxl,
            gap: t.space.md,
          }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          {exercises.map((exercise, index) => (
            <ExerciseLogCard
              key={`${exercise.name}-${index}`}
              exercise={exercise}
              index={index}
              previous={previous[exercise.name]}
              onChangeSet={handleChangeSet}
              onToggleSet={handleToggleSet}
              onAddSet={handleAddSet}
              onRemoveSet={handleRemoveSet}
            />
          ))}

          <Text variant="caption" tone="faint" align="center">
            Long press a checkmark to delete that set.
          </Text>
        </ScrollView>

        <RestTimer
          startedAt={restStartedAt}
          durationSeconds={restDuration}
          onDismiss={() => {
            setRestStartedAt(null);
            setRestDuration(DEFAULT_REST);
          }}
          onAdjust={(extra) => setRestDuration((d) => d + extra)}
        />
      </KeyboardAvoidingView>
    </Screen>
  );
}
