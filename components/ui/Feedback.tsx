import Feather from "@expo/vector-icons/Feather";
import { useEffect, useRef } from "react";
import { Animated, View, type ViewStyle } from "react-native";

import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { useTheme } from "@/hooks/useTheme";

/* ------------------------------------------------------------------ *
 * Skeleton
 * ------------------------------------------------------------------ */

export type SkeletonProps = {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  style?: ViewStyle;
};

/**
 * Shimmer placeholder. Used instead of a blocking spinner for anything the
 * network might take more than a moment to return, so the layout is already
 * the right shape when the data lands.
 */
export function Skeleton({
  width = "100%",
  height = 16,
  radius,
  style,
}: SkeletonProps) {
  const t = useTheme();
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        {
          width,
          height,
          borderRadius: radius ?? t.radius.sm,
          backgroundColor: t.colors.skeleton,
          opacity: pulse,
        },
        style,
      ]}
    />
  );
}

/* ------------------------------------------------------------------ *
 * EmptyState
 * ------------------------------------------------------------------ */

export type EmptyStateProps = {
  icon?: React.ComponentProps<typeof Feather>["name"];
  title: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
};

export function EmptyState({
  icon = "inbox",
  title,
  body,
  actionLabel,
  onAction,
  style,
}: EmptyStateProps) {
  const t = useTheme();

  return (
    <View
      style={[
        {
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: t.space.xxxl,
          paddingHorizontal: t.space.xl,
          gap: t.space.md,
        },
        style,
      ]}
    >
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: t.radius.pill,
          backgroundColor: t.colors.surfaceAlt,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Feather name={icon} size={26} color={t.colors.textMuted} />
      </View>
      <Text variant="h3" align="center">
        {title}
      </Text>
      {body ? (
        <Text variant="small" tone="muted" align="center" style={{ maxWidth: 300 }}>
          {body}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button
          label={actionLabel}
          onPress={onAction}
          size="sm"
          variant="secondary"
          style={{ marginTop: t.space.sm }}
        />
      ) : null}
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * ErrorState
 * ------------------------------------------------------------------ */

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      icon="alert-triangle"
      title="Something went wrong"
      body={message}
      actionLabel={onRetry ? "Try again" : undefined}
      onAction={onRetry}
    />
  );
}
