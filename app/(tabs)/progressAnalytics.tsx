import Feather from "@expo/vector-icons/Feather";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  LayoutAnimation,
  Pressable,
  RefreshControl,
  View,
} from "react-native";

import { Card } from "@/components/ui/Card";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/Feedback";
import { Screen } from "@/components/ui/Screen";
import { ProgressBar, StatTile } from "@/components/ui/Stat";
import { Text } from "@/components/ui/Text";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { fetchPastWorkouts } from "@/services/workoutAnalytic/fetchingServices";
import {
  formatCompactNumber,
  formatDurationShort,
  formatRelativeDate,
} from "@/services/workoutAnalytic/formatDate";
import {
  summarise,
  topSetsFor,
  type ProgressSummary,
} from "@/services/workoutAnalytic/progress";
import type { WorkoutLog } from "@/types/workout";

type Status = "loading" | "ready" | "error";

export default function ProgressAnalytics() {
  const t = useTheme();
  const { user } = useAuth();

  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    try {
      setLogs(await fetchPastWorkouts());
      setStatus("ready");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Your history could not be loaded.",
      );
      setStatus("error");
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

  // The whole summary used to be recomputed on every render, including on each
  // expand/collapse tap. It now runs only when the logs themselves change.
  const summary: ProgressSummary = useMemo(() => summarise(logs), [logs]);

  // Newest first for display; the maths wants oldest first.
  const history = useMemo(() => [...logs].reverse(), [logs]);

  const toggle = useCallback((id: string) => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(160, LayoutAnimation.Types.easeInEaseOut, "opacity"),
    );
    setExpanded((current) => ({ ...current, [id]: !current[id] }));
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: WorkoutLog }) => (
      <HistoryRow
        log={item}
        expanded={!!expanded[item.id]}
        onToggle={() => toggle(item.id)}
      />
    ),
    [expanded, toggle],
  );

  if (status === "error") {
    return (
      <Screen edges={["top"]}>
        <ErrorState message={message} onRetry={load} />
      </Screen>
    );
  }

  return (
    <Screen edges={["top"]}>
      <FlatList
        data={status === "ready" ? history : []}
        keyExtractor={(log) => log.id}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingHorizontal: t.space.lg,
          paddingBottom: t.space.xxl,
          gap: t.space.md,
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
        ListHeaderComponent={
          <View style={{ gap: t.space.lg, paddingBottom: t.space.xs }}>
            <View style={{ paddingTop: t.space.sm }}>
              <Text variant="h1">Progress</Text>
            </View>

            {status === "loading" ? (
              <ProgressSkeleton />
            ) : (
              <>
                <View style={{ flexDirection: "row", gap: t.space.sm }}>
                  <StatTile
                    label="Workouts"
                    value={String(summary.totalWorkouts)}
                    icon="activity"
                  />
                  <StatTile
                    label="Volume"
                    value={formatCompactNumber(summary.totalVolume)}
                    icon="layers"
                  />
                </View>

                <View style={{ flexDirection: "row", gap: t.space.sm }}>
                  <StatTile
                    label="Time"
                    value={formatDurationShort(summary.totalDuration)}
                    icon="clock"
                  />
                  <StatTile
                    label="Week streak"
                    value={String(summary.currentStreakWeeks)}
                    icon="zap"
                  />
                </View>

                {summary.muscleProgress.length > 0 ? (
                  <Card style={{ gap: t.space.base }}>
                    <View style={{ gap: t.space.xxs }}>
                      <Text variant="h3">Strength by muscle</Text>
                      <Text variant="caption" tone="faint">
                        Estimated 1RM change since your first comparable session
                      </Text>
                    </View>

                    <View style={{ gap: t.space.md }}>
                      {summary.muscleProgress.map((entry) => (
                        <MuscleRow key={entry.muscle} {...entry} />
                      ))}
                    </View>
                  </Card>
                ) : null}

                {history.length > 0 ? (
                  <Text variant="label" tone="faint">
                    History
                  </Text>
                ) : null}
              </>
            )}
          </View>
        }
        ListEmptyComponent={
          status === "ready" ? (
            <EmptyState
              icon="bar-chart-2"
              title="No sessions yet"
              body="Log your first workout and this fills up with volume, streaks and strength per muscle group."
            />
          ) : null
        }
      />
    </Screen>
  );
}

/** One muscle group's change, as a bar plus a signed number. */
function MuscleRow({ muscle, change }: { muscle: string; change: number }) {
  const t = useTheme();
  const rising = change >= 0;

  // Bars are scaled against 50%, which keeps ordinary gains readable instead of
  // flattening everything against one outlier.
  const magnitude = Math.min(Math.abs(change) / 50, 1);

  return (
    <View style={{ gap: t.space.xs }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: t.space.sm,
        }}
      >
        <Text variant="small" style={{ flex: 1 }} numberOfLines={1}>
          {muscle}
        </Text>
        <Feather
          name={rising ? "trending-up" : "trending-down"}
          size={13}
          color={rising ? t.colors.accent : t.colors.danger}
        />
        <Text variant="smallStrong" tone={rising ? "accent" : "danger"}>
          {`${rising ? "+" : ""}${change}%`}
        </Text>
      </View>
      <ProgressBar
        value={magnitude}
        tone={rising ? "accent" : "primary"}
        height={6}
        label={`${muscle} ${change} percent`}
      />
    </View>
  );
}

function HistoryRow({
  log,
  expanded,
  onToggle,
}: {
  log: WorkoutLog;
  expanded: boolean;
  onToggle: () => void;
}) {
  const t = useTheme();
  const sets = useMemo(() => topSetsFor(log), [log]);
  const totalSets = log.workout.reduce((sum, e) => sum + e.sets.length, 0);

  return (
    <Card padded={false}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={`${log.dayName}, ${formatRelativeDate(log.date)}`}
        accessibilityHint={expanded ? "Collapses details" : "Shows top sets"}
        onPress={onToggle}
        style={{ padding: t.space.base, gap: t.space.xxs }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: t.space.sm }}>
          <Text variant="title" style={{ flex: 1 }} numberOfLines={1}>
            {log.dayName}
          </Text>
          <Feather
            name={expanded ? "chevron-up" : "chevron-down"}
            size={18}
            color={t.colors.textFaint}
          />
        </View>

        <Text variant="caption" tone="faint">
          {`${formatRelativeDate(log.date)}  ·  ${totalSets} sets  ·  ${formatDurationShort(log.duration)}`}
        </Text>
      </Pressable>

      {expanded ? (
        <View
          style={{
            paddingHorizontal: t.space.base,
            paddingBottom: t.space.base,
            gap: t.space.sm,
            borderTopWidth: 1,
            borderTopColor: t.colors.border,
            paddingTop: t.space.md,
          }}
        >
          <Text variant="label" tone="faint">
            Top set per exercise
          </Text>

          {sets.map((set) => (
            <View
              key={set.exerciseName}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: t.space.md,
              }}
            >
              <Text variant="small" style={{ flex: 1 }} numberOfLines={1}>
                {set.exerciseName}
              </Text>
              <Text variant="caption" tone="muted">
                {`${set.weight} x ${set.reps}`}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </Card>
  );
}

function ProgressSkeleton() {
  const t = useTheme();
  return (
    <View style={{ gap: t.space.sm }}>
      <View style={{ flexDirection: "row", gap: t.space.sm }}>
        <Skeleton height={96} radius={t.radius.lg} />
        <Skeleton height={96} radius={t.radius.lg} />
      </View>
      <View style={{ flexDirection: "row", gap: t.space.sm }}>
        <Skeleton height={96} radius={t.radius.lg} />
        <Skeleton height={96} radius={t.radius.lg} />
      </View>
      <Skeleton height={180} radius={t.radius.xl} />
    </View>
  );
}
