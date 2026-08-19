import { useLocalSearchParams, useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Pressable, View } from "react-native";

import { AuthScaffold } from "@/components/AuthScaffold";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Text } from "@/components/ui/Text";
import { auth, db } from "@/firebase/config";
import { useTheme } from "@/hooks/useTheme";
import {
  authErrorField,
  authErrorMessage,
  isValidEmail,
} from "@/utils/authErrors";

type FieldErrors = {
  username?: string;
  email?: string;
  password?: string;
  confirm?: string;
  form?: string;
};

const MIN_PASSWORD = 6;

export default function SignUp() {
  const t = useTheme();
  const router = useRouter();
  const onboarding = useLocalSearchParams();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  const clear = (field: keyof FieldErrors) =>
    setErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (!username.trim()) next.username = "Pick a name to show on your profile.";
    if (!email.trim()) next.email = "Enter your email address.";
    else if (!isValidEmail(email)) next.email = "That does not look like an email.";
    if (!password) next.password = "Choose a password.";
    else if (password.length < MIN_PASSWORD)
      next.password = `Use at least ${MIN_PASSWORD} characters.`;
    if (confirm !== password) next.confirm = "The two passwords do not match.";
    return next;
  };

  const handleSignUp = async () => {
    const found = validate();
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      await setDoc(doc(db, "users", credential.user.uid), {
        username: username.trim(),
        email: email.trim(),
        createdAt: new Date().toISOString(),
        onboarding: {
          goal: onboarding.goal,
          gender: onboarding.gender,
          age: Number(onboarding.age),
          height: Number(onboarding.height),
          weight: Number(onboarding.weight),
          workoutDays: onboarding.workoutDays,
          sessionLength: onboarding.sessionLength,
          completedAt: new Date().toISOString(),
        },
      });

      router.replace("/homepage");
    } catch (error) {
      setErrors({ [authErrorField(error)]: authErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScaffold
      title="Create your account"
      subtitle="Your plan is ready. This is where it gets saved."
      formError={errors.form ?? null}
      footer={
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: t.space.xs,
          }}
        >
          <Text variant="small" tone="muted">
            Already registered?
          </Text>
          <Pressable
            accessibilityRole="link"
            hitSlop={10}
            onPress={() => router.push("/sign-in")}
          >
            <Text variant="smallStrong" tone="primary">
              Sign in
            </Text>
          </Pressable>
        </View>
      }
    >
      <Input
        label="Display name"
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          clear("username");
        }}
        error={errors.username}
        autoCapitalize="words"
        autoComplete="name"
        placeholder="How should we greet you?"
        maxLength={30}
      />

      <Input
        label="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          clear("email");
        }}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        placeholder="you@example.com"
      />

      <Input
        label="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          clear("password");
        }}
        error={errors.password}
        hint={`At least ${MIN_PASSWORD} characters.`}
        password
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        placeholder="Choose a password"
      />

      <Input
        label="Confirm password"
        value={confirm}
        onChangeText={(text) => {
          setConfirm(text);
          clear("confirm");
        }}
        error={errors.confirm}
        password
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        placeholder="Type it once more"
        onSubmitEditing={handleSignUp}
      />

      <Button
        label="Create account"
        size="lg"
        fullWidth
        loading={loading}
        onPress={handleSignUp}
        style={{ marginTop: t.space.sm }}
      />
    </AuthScaffold>
  );
}
