import { Text as RNText, type TextProps } from "react-native";

import type { TypeRole } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

type ToneName =
  | "default"
  | "muted"
  | "faint"
  | "primary"
  | "accent"
  | "danger"
  | "inverse"
  | "onPrimary";

export type AppTextProps = TextProps & {
  variant?: TypeRole;
  tone?: ToneName;
  align?: "left" | "center" | "right";
};

/**
 * The only text component in the app. Picking a `variant` keeps type sizes on
 * the scale, and `tone` keeps colours on the semantic tokens.
 */
export function Text({
  variant = "body",
  tone = "default",
  align,
  style,
  ...rest
}: AppTextProps) {
  const t = useTheme();

  const toneColor: Record<ToneName, string> = {
    default: t.colors.text,
    muted: t.colors.textMuted,
    faint: t.colors.textFaint,
    primary: t.colors.primary,
    accent: t.colors.accent,
    danger: t.colors.danger,
    inverse: t.colors.textInverse,
    onPrimary: t.colors.onPrimary,
  };

  return (
    <RNText
      // Respects the OS text-size setting but stops one long label from
      // pushing a card off screen at the largest accessibility sizes.
      maxFontSizeMultiplier={1.6}
      {...rest}
      style={[
        t.type[variant],
        { color: toneColor[tone] },
        align ? { textAlign: align } : null,
        style,
      ]}
    />
  );
}
