import Feather from "@expo/vector-icons/Feather";
import { View, type ViewStyle } from "react-native";

import { PressScale } from "@/components/ui/Pressable";
import { Text } from "@/components/ui/Text";
import { useTheme } from "@/hooks/useTheme";

export type ChoiceOption<T extends string> = {
  value: T;
  label: string;
  /** Optional second line, e.g. "4 sessions per week". */
  detail?: string;
};

export type ChoiceGroupProps<T extends string> = {
  options: readonly ChoiceOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  /** "row" wraps chips inline, "stack" gives each option a full-width row. */
  layout?: "row" | "stack";
  accessibilityLabel?: string;
  style?: ViewStyle;
};

/**
 * Single-select option group.
 *
 * Selection is shown with a border, a tinted fill and a check icon together, so
 * it never depends on colour alone. Every option is at least 48dp tall.
 */
export function ChoiceGroup<T extends string>({
  options,
  value,
  onChange,
  layout = "row",
  accessibilityLabel,
  style,
}: ChoiceGroupProps<T>) {
  const t = useTheme();
  const stacked = layout === "stack";

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      style={[
        {
          flexDirection: stacked ? "column" : "row",
          flexWrap: stacked ? "nowrap" : "wrap",
          gap: t.space.sm,
        },
        style,
      ]}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <PressScale
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={
              option.detail ? `${option.label}. ${option.detail}` : option.label
            }
            scaleTo={0.97}
            haptic="light"
            containerStyle={stacked ? undefined : { flexGrow: 1, flexBasis: "30%" }}
            style={{
              minHeight: t.hitTarget,
              justifyContent: "center",
              paddingVertical: t.space.md,
              paddingHorizontal: t.space.base,
              borderRadius: t.radius.lg,
              borderWidth: 1.5,
              borderColor: selected ? t.colors.primary : t.colors.border,
              backgroundColor: selected
                ? t.colors.primarySoft
                : t.colors.surfaceAlt,
            }}
            onPress={() => onChange(option.value)}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: t.space.sm,
              }}
            >
              <View style={{ flex: 1, gap: 2 }}>
                <Text
                  variant="smallStrong"
                  tone={selected ? "primary" : "default"}
                  align={stacked ? "left" : "center"}
                >
                  {option.label}
                </Text>
                {option.detail ? (
                  <Text
                    variant="caption"
                    tone="faint"
                    align={stacked ? "left" : "center"}
                  >
                    {option.detail}
                  </Text>
                ) : null}
              </View>
              {selected ? (
                <Feather name="check" size={16} color={t.colors.primary} />
              ) : null}
            </View>
          </PressScale>
        );
      })}
    </View>
  );
}
