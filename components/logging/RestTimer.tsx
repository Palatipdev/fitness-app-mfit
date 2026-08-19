import Feather from "@expo/vector-icons/Feather";
import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/Text";
import { formatDuration } from "@/services/workoutAnalytic/formatDate";
import { useTheme } from "@/hooks/useTheme";

export const REST_PRESETS = [60, 90, 120, 180];

export type RestTimerProps = {
  /** Timestamp the rest started. Null hides the bar. */
  startedAt: number | null;
  durationSeconds: number;
  onDismiss: () => void;
  onAdjust: (seconds: number) => void;
};

/**
 * Countdown bar shown after a set is checked off. Sits above the finish bar and
 * never blocks input; it is a prompt, not a modal.
 */
export function RestTimer({
  startedAt,
  durationSeconds,
  onDismiss,
  onAdjust,
}: RestTimerProps) {
  const t = useTheme();
  const [remaining, setRemaining] = useState(durationSeconds);
  const buzzed = useRef(false);

  useEffect(() => {
    if (startedAt === null) return;
    buzzed.current = false;

    const tick = () => {
      const left =
        durationSeconds - Math.floor((Date.now() - startedAt) / 1000);
      setRemaining(left);

      if (left <= 0 && !buzzed.current) {
        buzzed.current = true;
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        ).catch(() => {});
      }
    };

    tick();
    const interval = setInterval(tick, 500);
    return () => clearInterval(interval);
  }, [startedAt, durationSeconds]);

  if (startedAt === null) return null;

  const done = remaining <= 0;
  const progress = Math.max(0, Math.min(1, remaining / durationSeconds));

  return (
    <View
      style={{
        marginHorizontal: t.space.lg,
        marginBottom: t.space.sm,
        borderRadius: t.radius.lg,
        overflow: "hidden",
        backgroundColor: t.colors.surfaceAlt,
        borderWidth: 1,
        borderColor: done ? t.colors.accent : t.colors.border,
      }}
      accessibilityLiveRegion="polite"
    >
      {/* Fill drains left to right as the rest runs down. */}
      <View
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: `${progress * 100}%`,
          backgroundColor: t.colors.primarySoft,
        }}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: t.space.md,
          paddingHorizontal: t.space.base,
          paddingVertical: t.space.md,
        }}
      >
        <Feather
          name={done ? "check-circle" : "clock"}
          size={16}
          color={done ? t.colors.accent : t.colors.primary}
        />

        <Text variant="smallStrong" style={{ flex: 1 }}>
          {done ? "Rest done" : `Rest ${formatDuration(remaining)}`}
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add 30 seconds of rest"
          hitSlop={10}
          onPress={() => onAdjust(30)}
          style={{ paddingHorizontal: t.space.sm }}
        >
          <Text variant="smallStrong" tone="primary">
            +30s
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Skip rest"
          hitSlop={10}
          onPress={onDismiss}
        >
          <Feather name="x" size={18} color={t.colors.textMuted} />
        </Pressable>
      </View>
    </View>
  );
}
