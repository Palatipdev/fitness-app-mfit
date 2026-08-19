import { ActivityIndicator, StyleSheet, View, type ViewStyle } from "react-native";

import { Text } from "@/components/ui/Text";
import { PressScale } from "@/components/ui/Pressable";
import { useTheme } from "@/hooks/useTheme";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  /** Rendered before the label. Pass an icon element. */
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  accessibilityHint?: string;
};

const heights: Record<Size, number> = { sm: 40, md: 48, lg: 56 };
const padding: Record<Size, number> = { sm: 14, md: 20, lg: 24 };

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  style,
  accessibilityHint,
}: ButtonProps) {
  const t = useTheme();
  const isDisabled = disabled || loading;

  const surface: Record<Variant, ViewStyle> = {
    primary: { backgroundColor: t.colors.primary },
    secondary: {
      backgroundColor: t.colors.surfaceAlt,
      borderWidth: 1,
      borderColor: t.colors.border,
    },
    ghost: { backgroundColor: "transparent" },
    danger: { backgroundColor: t.colors.dangerSoft },
  };

  const labelTone = {
    primary: "onPrimary",
    secondary: "default",
    ghost: "primary",
    danger: "danger",
  } as const;

  const spinnerColor =
    variant === "primary" ? t.colors.onPrimary : t.colors.primary;

  return (
    <PressScale
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      haptic={variant === "primary" ? "medium" : "light"}
      scaleTo={0.96}
      containerStyle={fullWidth ? styles.fullWidth : undefined}
      style={[
        styles.base,
        surface[variant],
        {
          height: heights[size],
          paddingHorizontal: padding[size],
          borderRadius: t.radius.pill,
        },
        style,
      ]}
      onPress={onPress}
    >
      <View style={styles.content} pointerEvents="none">
        {loading ? (
          <ActivityIndicator size="small" color={spinnerColor} />
        ) : (
          <>
            {icon}
            <Text
              variant={size === "sm" ? "smallStrong" : "bodyStrong"}
              tone={labelTone[variant]}
              numberOfLines={1}
            >
              {label}
            </Text>
          </>
        )}
      </View>
    </PressScale>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: "center", justifyContent: "center" },
  fullWidth: { alignSelf: "stretch" },
  content: { flexDirection: "row", alignItems: "center", gap: 8 },
});
