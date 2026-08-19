import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Pressable, View } from "react-native";

import { AuthScaffold } from "@/components/AuthScaffold";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Text } from "@/components/ui/Text";
import { auth } from "@/firebase/config";
import { useTheme } from "@/hooks/useTheme";
import {
  authErrorField,
  authErrorMessage,
  isValidEmail,
} from "@/utils/authErrors";

type FieldErrors = { email?: string; password?: string; form?: string };

export default function SignIn() {
  const t = useTheme();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (!email.trim()) next.email = "Enter your email address.";
    else if (!isValidEmail(email)) next.email = "That does not look like an email.";
    if (!password) next.password = "Enter your password.";
    return next;
  };

  const handleSignIn = async () => {
    const found = validate();
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/homepage");
    } catch (error) {
      setErrors({ [authErrorField(error)]: authErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScaffold
      title="Welcome back"
      subtitle="Pick up where you left off."
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
            No account yet?
          </Text>
          <Pressable
            accessibilityRole="link"
            hitSlop={10}
            onPress={() => router.push("/onboarding")}
          >
            <Text variant="smallStrong" tone="primary">
              Build your plan
            </Text>
          </Pressable>
        </View>
      }
    >
      <Input
        label="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
        }}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        placeholder="you@example.com"
        returnKeyType="next"
      />

      <Input
        label="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
        }}
        error={errors.password}
        password
        autoCapitalize="none"
        autoComplete="current-password"
        textContentType="password"
        placeholder="Your password"
        returnKeyType="go"
        onSubmitEditing={handleSignIn}
      />

      <Button
        label="Sign in"
        size="lg"
        fullWidth
        loading={loading}
        onPress={handleSignIn}
        style={{ marginTop: t.space.sm }}
      />
    </AuthScaffold>
  );
}
