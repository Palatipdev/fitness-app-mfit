import { useEffect, useState } from "react";

import { Text } from "@/components/ui/Text";
import { formatDuration } from "@/services/workoutAnalytic/formatDate";

/**
 * Elapsed session time.
 *
 * Kept in its own component on purpose. The timer previously lived in the
 * logging screen's state, so every tick re-rendered every exercise card and
 * every TextInput once a second, which is what made typing feel sticky.
 *
 * Elapsed time is derived from a start timestamp rather than an incrementing
 * counter, so it stays correct if the app is backgrounded.
 */
export function WorkoutTimer({ startedAt }: { startedAt: number }) {
  const [seconds, setSeconds] = useState(() =>
    Math.floor((Date.now() - startedAt) / 1000),
  );

  useEffect(() => {
    const tick = () => setSeconds(Math.floor((Date.now() - startedAt) / 1000));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  return (
    <Text variant="numeric" tone="muted" accessibilityLabel="Elapsed time">
      {formatDuration(seconds)}
    </Text>
  );
}

/** Seconds elapsed since `startedAt`, for the value written to the log. */
export function elapsedSeconds(startedAt: number): number {
  return Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
}
