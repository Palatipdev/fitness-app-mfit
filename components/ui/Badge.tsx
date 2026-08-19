import { View, type StyleProp, type ViewStyle } from "react-native";

import { Text } from "@/components/ui/Text";
import { useTheme } from "@/hooks/useTheme";

type Tone = "neutral" | "primary" | "accent" | "danger" | "warning";

export type BadgeProps = {
  label: string;
  tone?: Tone;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Small non-interactive status chip. Wraps rather than truncates. */
export function Badge({ label, tone = "neutral", icon, style }: BadgeProps) {
  const t = useTheme();

  const surfaces: Record<Tone, { bg: string; fg: string }> = {
    neutral: { bg: t.colors.surfaceAlt, fg: t.colors.textMuted },
    primary: { bg: t.colors.primarySoft, fg: t.colors.primary },
    accent: { bg: t.colors.accentSoft, fg: t.colors.accent },
    danger: { bg: t.colors.dangerSoft, fg: t.colors.danger },
    warning: { bg: "rgba(245,158,11,0.16)", fg: t.colors.warning },
  };

  const { bg, fg } = surfaces[tone];

  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          gap: t.space.xs,
          alignSelf: "flex-start",
          backgroundColor: bg,
          paddingHorizontal: t.space.md,
          paddingVertical: 5,
          borderRadius: t.radius.pill,
        },
        style,
      ]}
    >
      {icon}
      <Text variant="caption" style={{ color: fg, fontFamily: t.type.smallStrong.fontFamily }}>
        {label}
      </Text>
    </View>
  );
}
