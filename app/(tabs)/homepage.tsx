import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";

import { WorkoutDayCard } from "@/components/WorkoutDayCard";
import { Card } from "@/components/ui/Card";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/Feedback";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { Badge } from "@/components/ui/Badge";
import { getSplit, toDayList } from "@/constants/splits";
import { isDemo } from "@/services/demo/demoMode";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { fetchPastWorkouts } from "@/services/workoutAnalytic/fetchingServices";
import { formatRelativeDate } from "@/services/workoutAnalytic/formatDate";
import { loadCurrentWorkout } from "@/services/workoutGenerator/workoutServices";
import type { PlannedDay, WeekLabel, WeekPlan } from "@/types/workout";
import { getUserProfile, weekLabelFor } from "@/utils/fetchData";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | {
      status: "ready";
      username: string;
      weekLabel: WeekLabel;
      splitName: string;
      days: PlannedDay[];
      lastLoggedTitle: string | null;
      lastLoggedDate: string | null;
    };

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/**
 * Picks the session to train next: the first day in the split that has not been
 * logged since the most recent one, falling back to the first day.
 */
function nextDayKey(days: PlannedDay[], lastLoggedTitle: string | null): string {
  if (!lastLoggedTitle) return days[0]?.key ?? "";
  const lastIndex = days.findIndex((day) => day.title === lastLoggedTitle);
  if (lastIndex === -1) return days[0]?.key ?? "";
  return days[(lastIndex + 1) % days.length].key;
}

export default function Homepage() {
  const t = useTheme();
  const router = useRouter();
  const { user } = useAuth();

  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      // Profile, plan and recent history are independent reads, so they run
      // together rather than in a waterfall.
      const [profile, workout, logs] = await Promise.all([
        getUserProfile(),
        loadCurrentWorkout(),
        fetchPastWorkouts(30).catch(() => []),
      ]);

      const weekLabel = weekLabelFor(profile.onboarding.completedAt);
      const week: WeekPlan = weekLabel === "A" ? workout.weekA : workout.weekB;
      const last = logs.at(-1) ?? null;

      setState({
        status: "ready",
        username: profile.username,
        weekLabel,
        splitName: getSplit(workout.workoutDays)?.name ?? "Your split",
        days: toDayList(week, workout.workoutDays),
        lastLoggedTitle: last?.dayName ?? null,
        lastLoggedDate: last?.date ?? null,
      });
    } catch (error) {
      setState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Your plan could not be loaded.",
      });
    }
  }, []);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const openLogging = useCallback(
    (day: PlannedDay) => {
      router.push({
        pathname: "/workoutLogging",
        params: {
          exercises: JSON.stringify(day.exercises),
          dayName: day.title,
        },
      });
    },
    [router],
  );

  const upNextKey = useMemo(
    () =>
      state.status === "ready"
        ? nextDayKey(state.days, state.lastLoggedTitle)
        : "",
    [state],
  );

  return (
    <Screen edges={["top"]}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: t.space.lg,
          paddingBottom: t.space.xxl,
          gap: t.space.lg,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={t.colors.primary}
            colors={[t.colors.primary]}
          />
        }
      >
        {isDemo() ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: t.space.sm,
              backgroundColor: t.colors.primarySoft,
              borderRadius: t.radius.md,
              paddingHorizontal: t.space.md,
              paddingVertical: t.space.sm,
              marginTop: t.space.sm,
            }}
          >
            <Feather name="info" size={14} color={t.colors.primary} />
            <Text variant="caption" tone="primary" style={{ flex: 1 }}>
              Demo mode. Sample data, nothing is saved.
            </Text>
          </View>
        ) : null}

        <View style={{ paddingTop: t.space.sm, gap: t.space.xxs }}>
          <Text variant="caption" tone="faint">
            {greeting()}
          </Text>
          <Text variant="h1">
            {state.status === "ready" && state.username
              ? state.username
              : "mfit."}
          </Text>
        </View>

        {state.status === "loading" ? <HomeSkeleton /> : null}

        {state.status === "error" ? (
          <ErrorState message={state.message} onRetry={load} />
        ) : null}

        {state.status === "ready" ? (
          <>
            <Card style={{ gap: t.space.md }} level={0}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: t.space.sm,
                  flexWrap: "wrap",
                }}
              >
                <Badge label={state.splitName} tone="primary" />
                <Badge label={`Week ${state.weekLabel}`} />
              </View>

              <Text variant="caption" tone="faint">
                {state.lastLoggedDate
                  ? `Last session: ${state.lastLoggedTitle} · ${formatRelativeDate(state.lastLoggedDate)}`
                  : "No sessions logged yet. Start with any day below."}
              </Text>
            </Card>

            {state.days.length === 0 ? (
              <EmptyState
                icon="clipboard"
                title="No plan yet"
                body="Your split has not been generated. Pull down to try again."
                actionLabel="Reload"
                onAction={load}
              />
            ) : (
              <View style={{ gap: t.space.md }}>
                <Text variant="label" tone="faint">
                  This week
                </Text>

                {state.days.map((day) => (
                  <WorkoutDayCard
                    key={day.key}
                    day={day}
                    onStart={openLogging}
                    highlighted={day.key === upNextKey}
                  />
                ))}
              </View>
            )}
          </>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

/** Matches the real layout, so nothing jumps when the data lands. */
function HomeSkeleton() {
  const t = useTheme();
  return (
    <View style={{ gap: t.space.md }}>
      <Skeleton height={72} radius={t.radius.xl} />
      {[0, 1, 2].map((row) => (
        <Card key={row} style={{ gap: t.space.md }}>
          <Skeleton width="45%" height={20} />
          <Skeleton width="30%" height={12} />
          <View style={{ gap: t.space.sm, marginTop: t.space.xs }}>
            <Skeleton height={12} />
            <Skeleton width="80%" height={12} />
            <Skeleton width="60%" height={12} />
          </View>
          <Skeleton height={48} radius={t.radius.pill} />
        </Card>
      ))}
    </View>
  );
}
