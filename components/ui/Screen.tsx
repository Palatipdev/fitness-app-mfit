import { StatusBar } from "expo-status-bar";
import { View, type ViewStyle } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

import { useTheme } from "@/hooks/useTheme";

export type ScreenProps = {
  children: React.ReactNode;
  /**
   * Which safe-area edges to inset. Screens inside the tab navigator leave
   * "bottom" off, because the tab bar already owns that inset.
   */
  edges?: readonly Edge[];
  style?: ViewStyle;
  /** Use the slightly lifted background, for screens that are all cards. */
  elevated?: boolean;
};

export function Screen({
  children,
  edges = ["top"],
  style,
  elevated = false,
}: ScreenProps) {
  const t = useTheme();
  const backgroundColor = elevated
    ? t.colors.backgroundElevated
    : t.colors.background;

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <StatusBar style={t.scheme === "dark" ? "light" : "dark"} />
      <SafeAreaView edges={edges} style={[{ flex: 1 }, style]}>
        {children}
      </SafeAreaView>
    </View>
  );
}
