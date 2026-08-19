import Feather from "@expo/vector-icons/Feather";
import { View, type ViewStyle } from "react-native";

import { Text } from "@/components/ui/Text";
import { useTheme } from "@/hooks/useTheme";

export type StatTileProps = {
  label: string;
  value: string;
  /** Signed percentage. Positive renders as a rise, negative as a drop. */
  delta?: number;
  icon?: React.ComponentProps<typeof Feather>["name"];
  style?: ViewStyle;
};

export function StatTile({ label, value, delta, icon, style }: StatTileProps) {
  const t = useTheme();
  const rising = (delta ?? 0) >= 0;

  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: t.colors.surface,
          borderRadius: t.radius.lg,
          borderWidth: 1,
          borderColor: t.colors.border,
          padding: t.space.base,
          gap: t.space.xs,
          minWidth: 0,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: t.space.xs }}>
        {icon ? (
          <Feather name={icon} size={13} color={t.colors.textFaint} />
        ) : null}
        <Text variant="label" tone="faint" numberOfLines={1} style={{ flex: 1 }}>
          {label}
        </Text>
      </View>

      <Text variant="numericLarge" numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>

      {delta !== undefined ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
          {/* Arrow plus sign, so the direction does not rely on colour alone. */}
          <Feather
            name={rising ? "trending-up" : "trending-down"}
            size={13}
            color={rising ? t.colors.accent : t.colors.danger}
          />
          <Text variant="caption" tone={rising ? "accent" : "danger"}>
            {`${rising ? "+" : ""}${delta}%`}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * ProgressBar
 * ------------------------------------------------------------------ */

export function ProgressBar({
  value,
  tone = "primary",
  height = 8,
  label,
}: {
  /** 0 to 1. Clamped. */
  value: number;
  tone?: "primary" | "accent";
  height?: number;
  label?: string;
}) {
  const t = useTheme();
  const pct = Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
  const fill = tone === "accent" ? t.colors.accent : t.colors.primary;

  return (
    <View
      style={{ gap: t.space.xs }}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(pct * 100) }}
      accessibilityLabel={label}
    >
      <View
        style={{
          height,
          borderRadius: height / 2,
          backgroundColor: t.colors.surfaceAlt,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${pct * 100}%`,
            height: "100%",
            borderRadius: height / 2,
            backgroundColor: fill,
          }}
        />
      </View>
    </View>
  );
}
