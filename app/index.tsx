import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import { AccessibilityInfo, Animated, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { useTheme } from "@/hooks/useTheme";
import { enableDemo, isDemo } from "@/services/demo/demoMode";

const HIGHLIGHTS = [
  { icon: "zap", text: "A split built around your schedule" },
  { icon: "repeat", text: "Two-week rotation so nothing goes stale" },
  { icon: "trending-up", text: "Strength tracked per muscle group" },
] as const;

export default function Welcome() {
  const t = useTheme();
  const router = useRouter();

  // Starts at its final opacity on purpose. Fading in from 0 meant the entire
  // landing page was invisible until an animation finished, so any hitch that
  // delayed or skipped it left a first-time visitor staring at a blank screen.
  // Only the offset is animated now; if it never runs, the content sits ten
  // pixels low, which nobody can see.
  const rise = useRef(new Animated.Value(10)).current;

  const startDemo = useCallback(() => {
    enableDemo();
    router.replace("/homepage");
  }, [router]);

  // A ?demo=1 link arrives already in demo mode, so skip the welcome screen.
  useEffect(() => {
    if (isDemo()) router.replace("/homepage");
  }, [router]);

  useEffect(() => {
    let cancelled = false;

    AccessibilityInfo.isReduceMotionEnabled()
      .then((reduceMotion) => {
        if (cancelled) return;
        if (reduceMotion) {
          rise.setValue(0);
          return;
        }
        Animated.timing(rise, {
          toValue: 0,
          duration: t.motion.slow,
          useNativeDriver: true,
        }).start();
      })
      .catch(() => rise.setValue(0));

    return () => {
      cancelled = true;
    };
  }, [rise, t.motion.slow]);

  return (
    <Screen edges={["top", "bottom"]}>
      {/* Ambient wash behind the headline. Purely decorative, so it is hidden
          from assistive tech. */}
      <LinearGradient
        colors={[t.colors.primarySoft, "transparent"]}
        style={{
          position: "absolute",
          top: -120,
          left: -80,
          right: -80,
          height: 420,
          borderRadius: 999,
        }}
        pointerEvents="none"
        accessibilityElementsHidden
      />

      <Animated.View
        style={{
          flex: 1,
          paddingHorizontal: t.space.xl,
          transform: [{ translateY: rise }],
        }}
      >
        <View style={{ paddingTop: t.space.lg }}>
          <Text variant="h1" tone="primary">
            mfit.
          </Text>
        </View>

        <View style={{ flex: 1, justifyContent: "center", gap: t.space.lg }}>
          <Text variant="display">
            Because fitness{"\n"}starts with you.
          </Text>

          <Text variant="body" tone="muted" style={{ maxWidth: 320 }}>
            Answer six questions and get a training split matched to your goal,
            your equipment and the time you actually have.
          </Text>

          <View style={{ gap: t.space.md, marginTop: t.space.sm }}>
            {HIGHLIGHTS.map((item) => (
              <View
                key={item.text}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: t.space.md,
                }}
              >
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: t.radius.md,
                    backgroundColor: t.colors.primarySoft,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Feather name={item.icon} size={16} color={t.colors.primary} />
                </View>
                <Text variant="small" tone="muted" style={{ flex: 1 }}>
                  {item.text}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ gap: t.space.md, paddingBottom: t.space.lg }}>
          <Button
            label="Get started"
            fullWidth
            size="lg"
            onPress={() => router.push("/onboarding")}
            accessibilityHint="Starts a short questionnaire to build your plan"
          />
          <Button
            label="Try the demo"
            variant="secondary"
            fullWidth
            icon={<Feather name="play" size={15} color={t.colors.text} />}
            onPress={startDemo}
            accessibilityHint="Opens the app with sample data, no account needed"
          />
          <Button
            label="I already have an account"
            variant="ghost"
            fullWidth
            onPress={() => router.push("/sign-in")}
          />
        </View>
      </Animated.View>
    </Screen>
  );
}
