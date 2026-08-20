import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useAppFonts } from "@/hooks/useAppFonts";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { ThemeProvider, useTheme } from "@/hooks/useTheme";

SplashScreen.preventAutoHideAsync().catch(() => {});

/** Route groups and routes that require a signed-in user. */
const PROTECTED = new Set(["(tabs)", "workoutLogging", "editProfile"]);

function RootNavigator({ fontsReady }: { fontsReady: boolean }) {
  const t = useTheme();
  const router = useRouter();
  const segments = useSegments();
  const { user, ready: authReady } = useAuth();

  // Rendering waits on fonts only. Gating it on the auth handshake too meant a
  // slow, blocked or offline Firebase left the app on a blank screen forever.
  // Redirects still wait for `authReady`, which is all it is needed for.
  const booted = fontsReady;

  const onLayout = useCallback(() => {
    if (booted) SplashScreen.hideAsync().catch(() => {});
  }, [booted]);

  // One guard for the whole app. Screens used to each run their own auth
  // listener and race each other to redirect.
  useEffect(() => {
    if (!booted || !authReady) return;
    const root = segments[0];

    if (!user && root && PROTECTED.has(root)) {
      router.replace("/");
    } else if (user && root === undefined) {
      router.replace("/homepage");
    }
  }, [booted, authReady, user, segments, router]);

  if (!booted) {
    return <View style={{ flex: 1, backgroundColor: t.colors.background }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.background }} onLayout={onLayout}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: t.colors.background },
          animation: "slide_from_right",
          animationDuration: t.motion.base,
        }}
      >
        <Stack.Screen name="index" options={{ animation: "fade" }} />
        <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
        {/* Logging is a focused task, so it arrives from the bottom and owns
            the screen rather than sliding in as another page. */}
        <Stack.Screen
          name="workoutLogging"
          options={{ animation: "slide_from_bottom", gestureEnabled: false }}
        />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  const fontsReady = useAppFonts();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <RootNavigator fontsReady={fontsReady} />
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
