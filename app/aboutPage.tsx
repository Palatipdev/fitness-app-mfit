import Feather from "@expo/vector-icons/Feather";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { Linking, Pressable, ScrollView, View } from "react-native";

import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { useTheme } from "@/hooks/useTheme";

const REPO_URL = "https://github.com/Palatipdev/fitness-app-mfit";
const CONTACT_EMAIL = "palatipten@gmail.com";

export default function AboutPage() {
  const t = useTheme();
  const router = useRouter();

  const version = Constants.expoConfig?.version ?? "1.0.0";

  const open = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <Screen edges={["top", "bottom"]}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: t.space.md,
          paddingHorizontal: t.space.lg,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
          onPress={() => router.back()}
          style={{ height: t.hitTarget, justifyContent: "center" }}
        >
          <Feather name="arrow-left" size={22} color={t.colors.text} />
        </Pressable>
        <Text variant="title">About</Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: t.space.lg,
          paddingBottom: t.space.xxl,
          gap: t.space.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ alignItems: "center", gap: t.space.xs, paddingVertical: t.space.lg }}>
          <Text variant="display" tone="primary">
            mfit.
          </Text>
          <Text variant="caption" tone="faint">
            {`Version ${version}`}
          </Text>
        </View>

        <Card style={{ gap: t.space.sm }}>
          <Text variant="h3">What it does</Text>
          <Text variant="small" tone="muted">
            mfit builds a training split around three things: how many days you
            can train, how long a session runs, and what you are training for.
            The plan rotates across a two-week cycle so you are not repeating
            the same session indefinitely, and it tracks estimated one-rep max
            per muscle group as you log.
          </Text>
        </Card>

        <Card style={{ gap: t.space.sm }}>
          <Text variant="h3">Who built it</Text>
          <Text variant="small" tone="muted">
            Built and designed by Palatip Boonmeerit, CS at the University of
            Melbourne.
          </Text>
        </Card>

        <View style={{ gap: t.space.sm }}>
          <Text variant="label" tone="faint">
            Links
          </Text>
          <Card padded={false}>
            <LinkRow
              icon="github"
              label="Source on GitHub"
              onPress={() => open(REPO_URL)}
            />
            <LinkRow
              icon="mail"
              label={CONTACT_EMAIL}
              onPress={() => open(`mailto:${CONTACT_EMAIL}`)}
              last
            />
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}

function LinkRow({
  icon,
  label,
  onPress,
  last = false,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  label: string;
  onPress: () => void;
  last?: boolean;
}) {
  const t = useTheme();

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={label}
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
      })}
    >
      <Feather name={icon} size={19} color={t.colors.text} />
      <Text variant="title" style={{ flex: 1 }} numberOfLines={1}>
        {label}
      </Text>
      <Feather name="external-link" size={16} color={t.colors.textFaint} />
    </Pressable>
  );
}
