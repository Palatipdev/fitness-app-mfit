import Feather from "@expo/vector-icons/Feather";
import { memo, useState } from "react";
import { LayoutAnimation, Platform, Pressable, UIManager, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { useTheme } from "@/hooks/useTheme";
import type { PlannedDay } from "@/types/workout";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const COLLAPSED_ROWS = 4;

export type WorkoutDayCardProps = {
  day: PlannedDay;
  onStart: (day: PlannedDay) => void;
  /** Marks the session the user is due to train next. */
  highlighted?: boolean;
};

/**
 * One training day. Collapsed it shows the first few movements; tapping the
 * card expands the rest in place rather than navigating away.
 */
function WorkoutDayCardBase({
  day,
  onStart,
  highlighted = false,
}: WorkoutDayCardProps) {
  const t = useTheme();
  const [expanded, setExpanded] = useState(false);

  const totalSets = day.exercises.reduce((sum, e) => sum + e.sets, 0);
  const hidden = day.exercises.length - COLLAPSED_ROWS;
  const visible = expanded
    ? day.exercises
    : day.exercises.slice(0, COLLAPSED_ROWS);

  const toggle = () => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        t.motion.fast,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity,
      ),
    );
    setExpanded((value) => !value);
  };

  return (
    <Card
      style={{
        gap: t.space.base,
        borderColor: highlighted ? t.colors.primary : t.colors.border,
        borderWidth: highlighted ? 1.5 : 1,
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={`${day.title}, ${day.exercises.length} exercises, ${totalSets} sets`}
        accessibilityHint={expanded ? "Collapses the list" : "Shows every exercise"}
        onPress={toggle}
        style={{ gap: t.space.xs }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: t.space.sm,
          }}
        >
          {highlighted ? (
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: t.colors.primary,
              }}
            />
          ) : null}
          <Text variant="h3" style={{ flex: 1 }} numberOfLines={1}>
            {day.title}
          </Text>
          <Feather
            name={expanded ? "chevron-up" : "chevron-down"}
            size={18}
            color={t.colors.textFaint}
          />
        </View>

        <Text variant="caption" tone="faint">
          {`${day.exercises.length} exercises  ·  ${totalSets} sets`}
        </Text>
      </Pressable>

      <View style={{ gap: t.space.sm }}>
        {visible.map((exercise, exerciseIndex) => (
          <View
            key={`${exercise.name}-${exerciseIndex}`}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: t.space.md,
            }}
          >
            <Text variant="small" style={{ flex: 1 }} numberOfLines={1}>
              {exercise.name}
            </Text>
            <Text variant="caption" tone="faint">
              {`${exercise.sets} x ${exercise.repRange}`}
            </Text>
          </View>
        ))}

        {!expanded && hidden > 0 ? (
          <Pressable onPress={toggle} hitSlop={8}>
            <Text variant="caption" tone="primary">
              {`+${hidden} more`}
            </Text>
          </Pressable>
        ) : null}
      </View>

      <Button
        label="Start workout"
        variant={highlighted ? "primary" : "secondary"}
        fullWidth
        onPress={() => onStart(day)}
        accessibilityHint={`Begins logging ${day.title}`}
      />
    </Card>
  );
}

/** Memoised: the home screen re-renders when the week label resolves. */
export const WorkoutDayCard = memo(WorkoutDayCardBase);
