import Feather from "@expo/vector-icons/Feather";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { auth, db } from "@/firebase/config";
import { useTheme } from "@/hooks/useTheme";

const MAX_NAME = 30;

export default function EditProfile() {
  const t = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();

  // The old screen read `params.currentName` while the profile screen sent
  // `name`, so the field always opened empty.
  const initialName = (params.currentName as string) ?? "";

  const [username, setUsername] = useState(initialName);
  const [error, setError] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  const dirty = username.trim() !== initialName.trim();

  const save = async () => {
    const trimmed = username.trim();
    if (!trimmed) {
      setError("Your display name cannot be empty.");
      return;
    }

    setSaving(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("You are no longer signed in.");

      await updateDoc(doc(db, "users", user.uid), { username: trimmed });
      router.back();
    } catch (saveError) {
      setSaving(false);
      Alert.alert(
        "Could not save",
        saveError instanceof Error
          ? saveError.message
          : "Check your connection and try again.",
      );
    }
  };

  const cancel = () => {
    if (!dirty) {
      router.back();
      return;
    }
    Alert.alert("Discard changes?", "Your edits will not be saved.", [
      { text: "Keep editing", style: "cancel" },
      { text: "Discard", style: "destructive", onPress: () => router.back() },
    ]);
  };

  return (
    <Screen edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
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
            onPress={cancel}
            style={{ height: t.hitTarget, justifyContent: "center" }}
          >
            <Feather name="arrow-left" size={22} color={t.colors.text} />
          </Pressable>
          <Text variant="title">Edit profile</Text>
        </View>

        <ScrollView
          contentContainerStyle={{
            padding: t.space.lg,
            gap: t.space.xl,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <Input
            label="Display name"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              if (error) setError(undefined);
            }}
            error={error}
            hint={`${username.trim().length}/${MAX_NAME} characters`}
            maxLength={MAX_NAME}
            autoCapitalize="words"
            autoComplete="name"
            placeholder="Your name"
            returnKeyType="done"
            onSubmitEditing={save}
          />
        </ScrollView>

        <View
          style={{
            paddingHorizontal: t.space.lg,
            paddingTop: t.space.md,
            paddingBottom: t.space.base,
            borderTopWidth: 1,
            borderTopColor: t.colors.border,
            gap: t.space.sm,
          }}
        >
          <Button
            label="Save changes"
            size="lg"
            fullWidth
            loading={saving}
            disabled={!dirty}
            onPress={save}
          />
          <Button label="Cancel" variant="ghost" fullWidth onPress={cancel} />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
