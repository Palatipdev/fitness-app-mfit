import Feather from "@expo/vector-icons/Feather";
import { useFocusEffect, useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { useCallback, useState } from "react";
import { Alert, Pressable, ScrollView, View } from "react-native";

import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { Skeleton } from "@/components/ui/Feedback";
import { StatTile } from "@/components/ui/Stat";
import { Text } from "@/components/ui/Text";
import { getSplit } from "@/constants/splits";
import { auth } from "@/firebase/config";
import { useAuth } from "@/hooks/useAuth";
import { exitDemo, isDemo } from "@/services/demo/demoMode";
import { useTheme, useThemePreference, type SchemePreference } from "@/hooks/useTheme";
import { fetchLogCount } from "@/services/workoutAnalytic/fetchingServices";
import { saveWorkout } from "@/services/workoutGenerator/workoutServices";
import { getUserProfile } from "@/utils/fetchData";

type Profile = { username: string; splitName: string; email: string };

export default function ProfilePage() {
  const t = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const { preference, setPreference } = useThemePreference();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [logCount, setLogCount] = useState<number | null>(null);
  const [regenerating, setRegenerating] = useState(false);

  // Refetches on focus, so a rename on the edit screen shows up on return.
  // The old version passed the new name back through route params instead,
  // which left the profile stale on any other path back to this screen.
  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      let cancelled = false;

      getUserProfile()
        .then(({ username, onboarding }) => {
          if (cancelled) return;
          setProfile({
            username,
            email: user.email ?? "",
            splitName: getSplit(onboarding.workoutDays)?.name ?? "Not set",
          });
        })
        .catch(() => {});

      fetchLogCount()
        .then((count) => !cancelled && setLogCount(count))
        .catch(() => !cancelled && setLogCount(0));

      return () => {
        cancelled = true;
      };
    }, [user]),
  );

  const confirmRegenerate = () => {
    Alert.alert(
      "Build a new plan?",
      "Your current split is replaced with a freshly generated one. Logged workouts are kept.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Regenerate",
          onPress: async () => {
            setRegenerating(true);
            try {
              await saveWorkout();
              router.replace("/homepage");
            } catch (error) {
              Alert.alert(
                "Could not regenerate",
                error instanceof Error
                  ? error.message
                  : "Check your connection and try again.",
              );
            } finally {
              setRegenerating(false);
            }
          },
        },
      ],
    );
  };

  const demo = isDemo();

  const confirmSignOut = () => {
    Alert.alert(
      demo ? "Leave the demo?" : "Sign out?",
      demo
        ? "Anything you logged during the demo is discarded."
        : "You will need your password to get back in.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: demo ? "Leave demo" : "Sign out",
          style: "destructive",
          onPress: async () => {
            if (demo) {
              exitDemo();
            } else {
              await signOut(auth);
            }
            router.replace("/");
          },
        },
      ],
    );
  };

  const initials = (profile?.username ?? "")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Screen edges={["top"]}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: t.space.lg,
          paddingBottom: t.space.xxl,
          gap: t.space.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingTop: t.space.sm }}>
          <Text variant="h1">Profile</Text>
        </View>

        <Card style={{ alignItems: "center", gap: t.space.md, paddingVertical: t.space.xl }}>
          <View
            style={{
              width: 88,
              height: 88,
              borderRadius: 44,
              backgroundColor: t.colors.primarySoft,
              borderWidth: 2,
              borderColor: t.colors.primary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {initials ? (
              <Text variant="h1" tone="primary">
                {initials}
              </Text>
            ) : (
              <Feather name="user" size={34} color={t.colors.primary} />
            )}
          </View>

          <View style={{ alignItems: "center", gap: 2 }}>
            {profile ? (
              <>
                <Text variant="h2">{profile.username || "Athlete"}</Text>
                <Text variant="caption" tone="faint">
                  {profile.email}
                </Text>
              </>
            ) : (
              <View style={{ gap: t.space.sm, alignItems: "center" }}>
                <Skeleton width={140} height={24} />
                <Skeleton width={180} height={12} />
              </View>
            )}
          </View>
        </Card>

        <View style={{ flexDirection: "row", gap: t.space.sm }}>
          <StatTile
            label="Workouts logged"
            value={logCount === null ? "-" : String(logCount)}
            icon="check-circle"
          />
          <StatTile
            label="Current split"
            value={profile?.splitName ?? "-"}
            icon="grid"
          />
        </View>

        <View style={{ gap: t.space.sm }}>
          <Text variant="label" tone="faint">
            Appearance
          </Text>
          <Card padded={false} style={{ padding: t.space.xs }}>
            <View style={{ flexDirection: "row", gap: t.space.xs }}>
              {(["system", "light", "dark"] as SchemePreference[]).map((mode) => {
                const active = preference === mode;
                return (
                  <Pressable
                    key={mode}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    accessibilityLabel={`${mode} theme`}
                    onPress={() => setPreference(mode)}
                    style={{
                      flex: 1,
                      minHeight: 44,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: t.radius.md,
                      backgroundColor: active
                        ? t.colors.primarySoft
                        : "transparent",
                    }}
                  >
                    <Text
                      variant="smallStrong"
                      tone={active ? "primary" : "muted"}
                      style={{ textTransform: "capitalize" }}
                    >
                      {mode}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Card>
        </View>

        <View style={{ gap: t.space.sm }}>
          <Text variant="label" tone="faint">
            Account
          </Text>
          <Card padded={false}>
            <SettingRow
              icon="user"
              label="Edit profile"
              onPress={() =>
                router.push({
                  pathname: "/editProfile",
                  params: { currentName: profile?.username ?? "" },
                })
              }
            />
            <SettingRow
              icon="refresh-cw"
              label={regenerating ? "Regenerating..." : "Regenerate my plan"}
              onPress={confirmRegenerate}
              disabled={regenerating}
            />
            <SettingRow
              icon="info"
              label="About mfit"
              onPress={() => router.push("/aboutPage")}
              last
            />
          </Card>
        </View>

        <Card padded={false}>
          <SettingRow
            icon="log-out"
            label={demo ? "Leave demo" : "Sign out"}
            tone="danger"
            onPress={confirmSignOut}
            last
          />
        </Card>
      </ScrollView>
    </Screen>
  );
}

function SettingRow({
  icon,
  label,
  onPress,
  tone = "default",
  last = false,
  disabled = false,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  label: string;
  onPress: () => void;
  tone?: "default" | "danger";
  last?: boolean;
  disabled?: boolean;
}) {
  const t = useTheme();
  const color = tone === "danger" ? t.colors.danger : t.colors.text;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: t.space.md,
        minHeight: 56,
        paddingHorizontal: t.space.base,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: t.colors.border,
        backgroundColor: pressed ? t.colors.surfacePressed : "transparent",
        opacity: disabled ? 0.5 : 1,
      })}
    >
      <Feather name={icon} size={19} color={color} />
      <Text variant="title" style={{ flex: 1, color }}>
        {label}
      </Text>
      <Feather name="chevron-right" size={18} color={t.colors.textFaint} />
    </Pressable>
  );
}
