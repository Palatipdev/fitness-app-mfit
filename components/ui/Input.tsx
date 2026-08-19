import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import {
  Pressable,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from "react-native";

import { Text } from "@/components/ui/Text";
import { useTheme } from "@/hooks/useTheme";

export type InputProps = Omit<TextInputProps, "style"> & {
  label: string;
  /** Shown under the field. Replaced by `error` when one is present. */
  hint?: string;
  error?: string;
  /** Adds a show/hide toggle and starts masked. */
  password?: boolean;
  suffix?: string;
  containerStyle?: ViewStyle;
};

/**
 * Labelled text field.
 *
 * The label sits above the field permanently rather than floating into it, so
 * it stays readable while typing and screen readers always find it. Errors
 * render directly under the field they belong to.
 */
export function Input({
  label,
  hint,
  error,
  password = false,
  suffix,
  containerStyle,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const t = useTheme();
  const [focused, setFocused] = useState(false);
  const [masked, setMasked] = useState(password);

  const borderColor = error
    ? t.colors.danger
    : focused
      ? t.colors.primary
      : t.colors.border;

  return (
    <View style={[{ gap: t.space.sm }, containerStyle]}>
      <Text variant="label" tone="muted">
        {label}
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: t.colors.surfaceAlt,
          borderRadius: t.radius.lg,
          borderWidth: 1.5,
          borderColor,
          paddingHorizontal: t.space.base,
        }}
      >
        <TextInput
          {...rest}
          secureTextEntry={masked}
          placeholderTextColor={t.colors.textFaint}
          selectionColor={t.colors.primary}
          accessibilityLabel={label}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={{
            flex: 1,
            height: 52,
            color: t.colors.text,
            ...t.type.body,
          }}
        />

        {suffix ? (
          <Text variant="small" tone="faint">
            {suffix}
          </Text>
        ) : null}

        {password ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={masked ? "Show password" : "Hide password"}
            hitSlop={12}
            onPress={() => setMasked((m) => !m)}
            style={{ paddingLeft: t.space.sm }}
          >
            <Feather
              name={masked ? "eye" : "eye-off"}
              size={18}
              color={t.colors.textMuted}
            />
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <View
          accessibilityLiveRegion="polite"
          style={{ flexDirection: "row", alignItems: "center", gap: t.space.xs }}
        >
          <Feather name="alert-circle" size={13} color={t.colors.danger} />
          <Text variant="caption" tone="danger" style={{ flex: 1 }}>
            {error}
          </Text>
        </View>
      ) : hint ? (
        <Text variant="caption" tone="faint">
          {hint}
        </Text>
      ) : null}
    </View>
  );
}
