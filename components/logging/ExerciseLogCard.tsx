import Feather from "@expo/vector-icons/Feather";
import { memo } from "react";
import { Pressable, TextInput, View } from "react-native";

import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { useTheme } from "@/hooks/useTheme";

export type DraftSet = {
  id: string;
  weight: string;
  reps: string;
  done: boolean;
  /** Set beat the stored best for this exercise when it was checked off. */
  isPr: boolean;
};

export type DraftExercise = {
  name: string;
  primaryMuscle: string;
  repRange: string;
  targetSets: number;
  sets: DraftSet[];
};

export type ExerciseLogCardProps = {
  exercise: DraftExercise;
  index: number;
  /** Best set previously recorded, rendered in the "previous" column. */
  previous?: { weight: number; reps: number };
  onChangeSet: (
    exerciseIndex: number,
    setId: string,
    patch: Partial<Pick<DraftSet, "weight" | "reps">>,
  ) => void;
  onToggleSet: (exerciseIndex: number, setId: string) => void;
  onAddSet: (exerciseIndex: number) => void;
  onRemoveSet: (exerciseIndex: number, setId: string) => void;
};

const COLUMN = { set: 34, prev: 74, field: 68, check: 40 };

/**
 * One exercise with its set table.
 *
 * Memoised on the exercise object, so typing in one card does not re-render the
 * others. Rows are pre-created from the planned set count and checked off as
 * they are completed, rather than being appended one at a time.
 */
function ExerciseLogCardBase({
  exercise,
  index,
  previous,
  onChangeSet,
  onToggleSet,
  onAddSet,
  onRemoveSet,
}: ExerciseLogCardProps) {
  const t = useTheme();
  const completed = exercise.sets.filter((s) => s.done).length;

  const numeric = (text: string) => text.replace(/[^0-9.]/g, "").slice(0, 6);

  return (
    <Card style={{ gap: t.space.md }}>
      <View style={{ gap: t.space.xxs }}>
        <Text variant="h3" numberOfLines={2}>
          {exercise.name}
        </Text>
        <Text variant="caption" tone="faint">
          {`${exercise.primaryMuscle}  ·  target ${exercise.targetSets} x ${exercise.repRange}  ·  ${completed}/${exercise.sets.length} done`}
        </Text>
      </View>

      {/* Column headers */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: t.space.sm }}>
        <Text variant="label" tone="faint" style={{ width: COLUMN.set }}>
          Set
        </Text>
        <Text variant="label" tone="faint" style={{ width: COLUMN.prev }}>
          Prev
        </Text>
        <Text
          variant="label"
          tone="faint"
          style={{ width: COLUMN.field }}
          align="center"
        >
          Weight
        </Text>
        <Text
          variant="label"
          tone="faint"
          style={{ width: COLUMN.field }}
          align="center"
        >
          Reps
        </Text>
        <View style={{ width: COLUMN.check }} />
      </View>

      <View style={{ gap: t.space.sm }}>
        {exercise.sets.map((set, setIndex) => (
          <View
            key={set.id}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: t.space.sm,
              backgroundColor: set.done ? t.colors.accentSoft : "transparent",
              borderRadius: t.radius.sm,
              paddingVertical: 2,
            }}
          >
            <View
              style={{
                width: COLUMN.set,
                flexDirection: "row",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Text variant="smallStrong" tone={set.done ? "accent" : "muted"}>
                {setIndex + 1}
              </Text>
              {set.isPr ? (
                <Feather name="award" size={12} color={t.colors.warning} />
              ) : null}
            </View>

            <Text variant="caption" tone="faint" style={{ width: COLUMN.prev }}>
              {previous ? `${previous.weight}x${previous.reps}` : "-"}
            </Text>

            <TextInput
              value={set.weight}
              onChangeText={(text) =>
                onChangeSet(index, set.id, { weight: numeric(text) })
              }
              keyboardType="decimal-pad"
              placeholder={previous ? String(previous.weight) : "0"}
              placeholderTextColor={t.colors.textFaint}
              selectionColor={t.colors.primary}
              accessibilityLabel={`Set ${setIndex + 1} weight`}
              style={{
                width: COLUMN.field,
                height: 42,
                textAlign: "center",
                borderRadius: t.radius.sm,
                backgroundColor: t.colors.surfaceAlt,
                color: t.colors.text,
                ...t.type.numeric,
              }}
            />

            <TextInput
              value={set.reps}
              onChangeText={(text) =>
                onChangeSet(index, set.id, { reps: numeric(text) })
              }
              keyboardType="number-pad"
              placeholder={previous ? String(previous.reps) : "0"}
              placeholderTextColor={t.colors.textFaint}
              selectionColor={t.colors.primary}
              accessibilityLabel={`Set ${setIndex + 1} reps`}
              style={{
                width: COLUMN.field,
                height: 42,
                textAlign: "center",
                borderRadius: t.radius.sm,
                backgroundColor: t.colors.surfaceAlt,
                color: t.colors.text,
                ...t.type.numeric,
              }}
            />

            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: set.done }}
              accessibilityLabel={`Mark set ${setIndex + 1} complete`}
              onPress={() => onToggleSet(index, set.id)}
              onLongPress={() => onRemoveSet(index, set.id)}
              hitSlop={6}
              style={{
                width: COLUMN.check,
                height: 42,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: t.radius.sm,
                backgroundColor: set.done
                  ? t.colors.accent
                  : t.colors.surfaceAlt,
              }}
            >
              <Feather
                name="check"
                size={18}
                color={set.done ? t.colors.onAccent : t.colors.textFaint}
              />
            </Pressable>
          </View>
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Add a set to ${exercise.name}`}
        onPress={() => onAddSet(index)}
        style={{
          height: 40,
          borderRadius: t.radius.md,
          borderWidth: 1,
          borderColor: t.colors.border,
          borderStyle: "dashed",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: t.space.xs,
        }}
      >
        <Feather name="plus" size={14} color={t.colors.textMuted} />
        <Text variant="caption" tone="muted">
          Add set
        </Text>
      </Pressable>
    </Card>
  );
}

export const ExerciseLogCard = memo(ExerciseLogCardBase);
