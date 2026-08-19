import Feather from "@expo/vector-icons/Feather";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Text } from "@/components/ui/Text";
import { useTheme } from "@/hooks/useTheme";

type IconName = React.ComponentProps<typeof Feather>["name"];

const ICONS: Record<string, IconName> = {
  homepage: "home",
  progressAnalytics: "bar-chart-2",
  profilePage: "user",
};

const LABELS: Record<string, string> = {
  homepage: "Train",
  progressAnalytics: "Progress",
  profilePage: "Profile",
};

/**
 * Bottom navigation.
 *
 * Replaces the three hand-rolled nav rows that were copy-pasted across screens.
 * Those had no active state, no safe-area inset, a 30pt tap height and pushed a
 * new route even when you tapped the screen you were already on.
 */
export function TabBar({ state, navigation }: BottomTabBarProps) {
  const t = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: t.colors.backgroundElevated,
        borderTopWidth: 1,
        borderTopColor: t.colors.border,
        paddingTop: t.space.sm,
        // Keeps the row clear of the home indicator without a magic number.
        paddingBottom: Math.max(insets.bottom, t.space.md),
        paddingHorizontal: t.space.sm,
      }}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const icon = ICONS[route.name] ?? "circle";
        const label = LABELS[route.name] ?? route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          // Tapping the active tab is a no-op instead of remounting the screen.
          if (focused || event.defaultPrevented) return;

          Haptics.selectionAsync().catch(() => {});
          navigation.navigate(route.name);
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={label}
            onPress={onPress}
            style={({ pressed }) => ({
              flex: 1,
              minHeight: t.hitTarget,
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              borderRadius: t.radius.md,
              opacity: pressed ? 0.65 : 1,
            })}
          >
            <Feather
              name={icon}
              size={22}
              color={focused ? t.colors.primary : t.colors.textFaint}
            />
            {/* Icon plus label, so the active tab does not rely on colour. */}
            <Text
              variant="caption"
              tone={focused ? "primary" : "faint"}
              style={
                focused ? { fontFamily: t.type.smallStrong.fontFamily } : undefined
              }
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
