import * as Haptics from "expo-haptics";
import { useCallback, useRef } from "react";
import {
  Animated,
  Pressable as RNPressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { motion } from "@/constants/theme";

export type PressScaleProps = Omit<PressableProps, "style"> & {
  style?: StyleProp<ViewStyle>;
  /** Applied to the animated wrapper. Use for layout (flex, alignSelf). */
  containerStyle?: StyleProp<ViewStyle>;
  /** How far the surface sinks on press. Cards use less than buttons. */
  scaleTo?: number;
  haptic?: "light" | "medium" | "success" | "none";
};

/**
 * Pressable with a scale + opacity press state.
 *
 * Scale is animated on the native driver so the feedback lands inside the
 * ~100ms budget, and it never changes layout bounds, so neighbouring content
 * does not shift.
 */
export function PressScale({
  style,
  containerStyle,
  scaleTo = 0.97,
  haptic = "light",
  onPressIn,
  onPress,
  disabled,
  ...rest
}: PressScaleProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const animate = useCallback(
    (to: number, duration: number) => {
      Animated.timing(scale, {
        toValue: to,
        duration,
        useNativeDriver: true,
      }).start();
    },
    [scale],
  );

  const handlePressIn = useCallback<NonNullable<PressableProps["onPressIn"]>>(
    (e) => {
      animate(scaleTo, motion.instant);
      onPressIn?.(e);
    },
    [animate, scaleTo, onPressIn],
  );

  const handlePressOut = useCallback(() => {
    animate(1, motion.fast);
  }, [animate]);

  const handlePress = useCallback<NonNullable<PressableProps["onPress"]>>(
    (e) => {
      if (haptic !== "none") {
        const style =
          haptic === "success"
            ? Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
            : Haptics.impactAsync(
                haptic === "medium"
                  ? Haptics.ImpactFeedbackStyle.Medium
                  : Haptics.ImpactFeedbackStyle.Light,
              );
        // Haptics are a nicety; a device without a taptic engine must not throw.
        void Promise.resolve(style).catch(() => {});
      }
      onPress?.(e);
    },
    [haptic, onPress],
  );

  return (
    <Animated.View style={[containerStyle, { transform: [{ scale }] }]}>
      <RNPressable
        {...rest}
        disabled={disabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={[style, disabled ? { opacity: 0.45 } : null]}
      />
    </Animated.View>
  );
}
