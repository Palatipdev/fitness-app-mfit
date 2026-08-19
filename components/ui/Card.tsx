import {
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";

import { PressScale } from "@/components/ui/Pressable";
import { useTheme } from "@/hooks/useTheme";

export type CardProps = ViewProps & {
  /** 0 flat, 1 raised, 2 floating. Keeps shadows on one scale. */
  level?: 0 | 1 | 2;
  padded?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function Card({
  level = 1,
  padded = true,
  onPress,
  style,
  children,
  ...rest
}: CardProps) {
  const t = useTheme();

  const base: ViewStyle = {
    backgroundColor: t.colors.surface,
    borderRadius: t.radius.xl,
    borderWidth: 1,
    borderColor: t.colors.border,
    padding: padded ? t.space.base : 0,
    ...(t.scheme === "light" ? t.elevation(level) : {}),
  };

  if (onPress) {
    return (
      <PressScale
        accessibilityRole="button"
        scaleTo={0.985}
        style={[base, style]}
        onPress={onPress}
        {...rest}
      >
        {children}
      </PressScale>
    );
  }

  return (
    <View style={[base, style]} {...rest}>
      {children}
    </View>
  );
}
