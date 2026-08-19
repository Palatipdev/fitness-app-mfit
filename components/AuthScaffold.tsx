import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";

import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { useTheme } from "@/hooks/useTheme";

export type AuthScaffoldProps = {
  title: string;
  subtitle?: string;
  /** Rendered pinned under the form, e.g. the "no account yet" link. */
  footer?: React.ReactNode;
  /** Shown above the fields after a failed submit. */
  formError?: string | null;
  children: React.ReactNode;
};

/**
 * Shared frame for the sign-in and sign-up screens: back affordance, heading,
 * keyboard handling and a form-level error region.
 */
export function AuthScaffold({
  title,
  subtitle,
  footer,
  formError,
  children,
}: AuthScaffoldProps) {
  const t = useTheme();
  const router = useRouter();

  return (
    <Screen edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: t.space.xl,
            paddingBottom: t.space.xl,
          }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={12}
            onPress={() => router.back()}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: t.space.xs,
              height: t.hitTarget,
              alignSelf: "flex-start",
            }}
          >
            <Feather name="arrow-left" size={22} color={t.colors.text} />
            <Text variant="smallStrong">Back</Text>
          </Pressable>

          <View style={{ gap: t.space.sm, marginTop: t.space.lg }}>
            <Text variant="h1">{title}</Text>
            {subtitle ? (
              <Text variant="body" tone="muted">
                {subtitle}
              </Text>
            ) : null}
          </View>

          {formError ? (
            <View
              accessibilityLiveRegion="assertive"
              accessibilityRole="alert"
              style={{
                flexDirection: "row",
                gap: t.space.sm,
                alignItems: "flex-start",
                backgroundColor: t.colors.dangerSoft,
                borderRadius: t.radius.md,
                padding: t.space.md,
                marginTop: t.space.lg,
              }}
            >
              <Feather
                name="alert-circle"
                size={16}
                color={t.colors.danger}
                style={{ marginTop: 2 }}
              />
              <Text variant="small" tone="danger" style={{ flex: 1 }}>
                {formError}
              </Text>
            </View>
          ) : null}

          <View style={{ gap: t.space.lg, marginTop: t.space.xl, flex: 1 }}>
            {children}
          </View>

          {footer ? <View style={{ marginTop: t.space.xl }}>{footer}</View> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
