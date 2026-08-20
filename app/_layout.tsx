import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect } from "react";
import { Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useAppFonts } from "@/hooks/useAppFonts";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { ThemeProvider, useTheme } from "@/hooks/useTheme";

SplashScreen.preventAutoHideAsync().catch(() => {});

/**
 * On a desktop browser the layout would otherwise stretch to the full window,
 * leaving an exercise name on the far left and its rep count a thousand pixels
 * away. This is a phone UI, so it is held to a phone-sized column.
 */
const WEB_MAX_WIDTH = 480;

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

  const isWeb = Platform.OS === "web";

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: t.colors.background,
        alignItems: isWeb ? "center" : undefined,
      }}
      onLayout={onLayout}
    >
      <View
        style={[
          { flex: 1, width: "100%" },
          isWeb && {
            maxWidth: WEB_MAX_WIDTH,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderColor: t.colors.border,
          },
        ]}
      >
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
