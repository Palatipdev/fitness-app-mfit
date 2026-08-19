import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, View } from "react-native";

import exerciseData from "@/exercises.json";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { getSplit, toDayList } from "@/constants/splits";
import { useTheme } from "@/hooks/useTheme";
import { buildWeek } from "@/services/workoutGenerator/generator";
import type {
  Exercise,
  SessionLengthAnswer,
  WorkoutDaysAnswer,
} from "@/types/workout";

/** How many days are shown in full before the plan fades out. */
const VISIBLE_DAYS = 2;

export default function ResultPreview() {
  const t = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();

  const workoutDays = params.workoutDays as WorkoutDaysAnswer;
  const sessionLength = params.sessionLength as SessionLengthAnswer;

  const split = getSplit(workoutDays);

  // Built from the bundled exercise list, so the preview shows the plan the
  // user will actually get rather than a hardcoded sample.
  const days = useMemo(() => {
    const week = buildWeek(
      exerciseData as Exercise[],
      workoutDays,
      sessionLength,
      "A",
    );
    return toDayList(week, workoutDays);
  }, [workoutDays, sessionLength]);

  const totalExercises = days.reduce((sum, day) => sum + day.exercises.length, 0);
  const totalSets = days.reduce(
    (sum, day) => sum + day.exercises.reduce((s, e) => s + e.sets, 0),
    0,
  );

  const sessionLabel =
    sessionLength === "30"
      ? "Up to 30 min"
      : sessionLength === "30-60"
        ? "30 to 60 min"
        : "60+ min";

  return (
    <Screen edges={["top", "bottom"]}>
      <View style={{ paddingHorizontal: t.space.xl }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
          onPress={() => router.back()}
          style={{ height: t.hitTarget, justifyContent: "center" }}
        >
          <Feather name="arrow-left" size={22} color={t.colors.text} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: t.space.xl,
          paddingBottom: t.space.xxl,
          gap: t.space.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: t.space.sm }}>
          <Badge label="Your plan is ready" tone="accent" />
          <Text variant="h1">{split?.name ?? "Your split"}</Text>
          <Text variant="body" tone="muted">
            {split?.description}. Two weeks of variation, then it rotates.
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: t.space.sm, flexWrap: "wrap" }}>
          <Badge label={`${days.length} sessions`} tone="primary" />
          <Badge label={sessionLabel} />
          <Badge label={`${totalExercises} exercises`} />
          <Badge label={`${totalSets} sets`} />
        </View>

        <View style={{ gap: t.space.md }}>
          {days.slice(0, VISIBLE_DAYS).map((day) => (
            <Card key={day.key} style={{ gap: t.space.md }}>
              <Text variant="h3">{day.title}</Text>

              <View style={{ gap: t.space.sm }}>
                {day.exercises.map((exercise, exerciseIndex) => (
                  <View
                    key={`${exercise.name}-${exerciseIndex}`}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: t.space.md,
                    }}
                  >
                    <Text
                      variant="small"
                      style={{ flex: 1 }}
                      numberOfLines={2}
                    >
                      {exercise.name}
                    </Text>
                    <Text variant="caption" tone="faint">
                      {`${exercise.sets} x ${exercise.repRange}`}
                    </Text>
                  </View>
                ))}
              </View>
            </Card>
          ))}
        </View>

        {days.length > VISIBLE_DAYS ? (
          <View>
            <Card style={{ gap: t.space.md, opacity: 0.75 }}>
              <Text variant="h3">{days[VISIBLE_DAYS].title}</Text>
              <View style={{ gap: t.space.sm }}>
                {days[VISIBLE_DAYS].exercises.slice(0, 4).map((exercise, i) => (
                  <Text key={`${exercise.name}-${i}`} variant="small" numberOfLines={1}>
                    {exercise.name}
                  </Text>
                ))}
              </View>
            </Card>

            {/* Fades the remaining days out rather than cutting them off. */}
            <LinearGradient
              colors={["transparent", t.colors.background]}
              locations={[0, 0.85]}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: 140,
              }}
              pointerEvents="none"
              accessibilityElementsHidden
            />
          </View>
        ) : null}

        <Text variant="caption" tone="faint" align="center">
          {days.length > VISIBLE_DAYS
            ? `Plus ${days.length - VISIBLE_DAYS} more sessions in the full plan.`
            : "Your full plan is above."}
        </Text>
      </ScrollView>

      <View
        style={{
          paddingHorizontal: t.space.xl,
          paddingTop: t.space.md,
          paddingBottom: t.space.base,
          borderTopWidth: 1,
          borderTopColor: t.colors.border,
          gap: t.space.sm,
        }}
      >
        <Button
          label="Save my plan"
          size="lg"
          fullWidth
          onPress={() =>
            router.push({ pathname: "/sign-up", params })
          }
        />
        <Text variant="caption" tone="faint" align="center">
          Create an account to keep it and start logging.
        </Text>
      </View>
    </Screen>
  );
}
