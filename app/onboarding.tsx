import Feather from "@expo/vector-icons/Feather";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";

import { Button } from "@/components/ui/Button";
import { ChoiceGroup, type ChoiceOption } from "@/components/ui/Choice";
import { Input } from "@/components/ui/Input";
import { Screen } from "@/components/ui/Screen";
import { ProgressBar } from "@/components/ui/Stat";
import { Text } from "@/components/ui/Text";
import { useTheme } from "@/hooks/useTheme";
import type {
  GenderAnswer,
  GoalAnswer,
  SessionLengthAnswer,
  WorkoutDaysAnswer,
} from "@/types/workout";

type Answers = {
  goal: GoalAnswer | null;
  gender: GenderAnswer | null;
  age: string;
  height: string;
  weight: string;
  workoutDays: WorkoutDaysAnswer | null;
  sessionLength: SessionLengthAnswer | null;
};

const GOALS: ChoiceOption<GoalAnswer>[] = [
  { value: "wl", label: "Lose fat", detail: "Keep strength while cutting" },
  { value: "maintain", label: "Maintain", detail: "Hold your current shape" },
  { value: "gain", label: "Build muscle", detail: "Add size and strength" },
];

const GENDERS: ChoiceOption<GenderAnswer>[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const DAYS: ChoiceOption<WorkoutDaysAnswer>[] = [
  { value: "2", label: "2 or fewer", detail: "Full body" },
  { value: "3-4", label: "3 to 4", detail: "Upper / lower" },
  { value: "4", label: "4 or more", detail: "Push pull legs" },
];

const SESSIONS: ChoiceOption<SessionLengthAnswer>[] = [
  { value: "30", label: "Up to 30 min", detail: "Tight, compound focused" },
  { value: "30-60", label: "30 to 60 min", detail: "The usual session" },
  { value: "60+", label: "Over an hour", detail: "Room for extra volume" },
];

/** lbs and cm are what gets stored; the toggles only change what you type. */
const LB_PER_KG = 2.2046226;
const CM_PER_IN = 2.54;

const STEP_COUNT = 5;

export default function Onboarding() {
  const t = useTheme();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [weightUnit, setWeightUnit] = useState<"lb" | "kg">("lb");
  const [heightUnit, setHeightUnit] = useState<"cm" | "in">("cm");
  const [answers, setAnswers] = useState<Answers>({
    goal: null,
    gender: null,
    age: "",
    height: "",
    weight: "",
    workoutDays: null,
    sessionLength: null,
  });

  const set = <K extends keyof Answers>(key: K, value: Answers[K]) =>
    setAnswers((prev) => ({ ...prev, [key]: value }));

  const digitsOnly = (text: string) => text.replace(/[^0-9]/g, "");

  const back = useCallback(() => {
    if (step > 0) {
      setStep((s) => s - 1);
      return true;
    }
    router.back();
    return true;
  }, [step, router]);

  // Android hardware back walks the wizard instead of dropping the whole flow.
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener("hardwareBackPress", back);
      return () => sub.remove();
    }, [back]),
  );

  const ageNumber = Number(answers.age);
  const heightNumber = Number(answers.height);
  const weightNumber = Number(answers.weight);

  const stepValid = useMemo(() => {
    switch (step) {
      case 0:
        return answers.goal !== null;
      case 1:
        return answers.gender !== null && ageNumber >= 13 && ageNumber <= 100;
      case 2:
        return heightNumber > 0 && weightNumber > 0;
      case 3:
        return answers.workoutDays !== null;
      case 4:
        return answers.sessionLength !== null;
      default:
        return false;
    }
  }, [step, answers, ageNumber, heightNumber, weightNumber]);

  const finish = () => {
    const weightLb =
      weightUnit === "lb" ? weightNumber : weightNumber * LB_PER_KG;
    const heightCm =
      heightUnit === "cm" ? heightNumber : heightNumber * CM_PER_IN;

    router.push({
      pathname: "/resultPreview",
      params: {
        goal: answers.goal!,
        gender: answers.gender!,
        age: answers.age,
        weight: Math.round(weightLb).toString(),
        height: Math.round(heightCm).toString(),
        workoutDays: answers.workoutDays!,
        sessionLength: answers.sessionLength!,
      },
    });
  };

  const STEPS = [
    {
      title: "What are you training for?",
      hint: "This sets how much volume your plan carries.",
      body: (
        <ChoiceGroup
          options={GOALS}
          value={answers.goal}
          onChange={(v) => set("goal", v)}
          layout="stack"
          accessibilityLabel="Training goal"
        />
      ),
    },
    {
      title: "Tell us about you",
      hint: "Used to scale starting loads, nothing else.",
      body: (
        <View style={{ gap: t.space.xl }}>
          <View style={{ gap: t.space.sm }}>
            <Text variant="label" tone="muted">
              Sex
            </Text>
            <ChoiceGroup
              options={GENDERS}
              value={answers.gender}
              onChange={(v) => set("gender", v)}
              accessibilityLabel="Sex"
            />
          </View>
          <Input
            label="Age"
            value={answers.age}
            onChangeText={(text) => set("age", digitsOnly(text))}
            keyboardType="number-pad"
            placeholder="24"
            maxLength={3}
            suffix="years"
            error={
              answers.age && (ageNumber < 13 || ageNumber > 100)
                ? "Enter an age between 13 and 100."
                : undefined
            }
          />
        </View>
      ),
    },
    {
      title: "Your measurements",
      hint: "Tap the unit to switch.",
      body: (
        <View style={{ gap: t.space.xl }}>
          <View style={{ gap: t.space.sm }}>
            <UnitRow
              label="Weight"
              unit={weightUnit}
              options={["lb", "kg"]}
              onChange={setWeightUnit}
            />
            <Input
              accessibilityLabel="Weight"
              value={answers.weight}
              onChangeText={(text) => set("weight", digitsOnly(text))}
              keyboardType="number-pad"
              placeholder={weightUnit === "lb" ? "170" : "77"}
              maxLength={3}
              suffix={weightUnit}
            />
          </View>

          <View style={{ gap: t.space.sm }}>
            <UnitRow
              label="Height"
              unit={heightUnit}
              options={["cm", "in"]}
              onChange={setHeightUnit}
            />
            <Input
              accessibilityLabel="Height"
              value={answers.height}
              onChangeText={(text) => set("height", digitsOnly(text))}
              keyboardType="number-pad"
              placeholder={heightUnit === "cm" ? "178" : "70"}
              maxLength={3}
              suffix={heightUnit}
            />
          </View>
        </View>
      ),
    },
    {
      title: "How many days can you train?",
      hint: "Be honest. The split is built around this.",
      body: (
        <ChoiceGroup
          options={DAYS}
          value={answers.workoutDays}
          onChange={(v) => set("workoutDays", v)}
          layout="stack"
          accessibilityLabel="Training days per week"
        />
      ),
    },
    {
      title: "How long is a session?",
      hint: "Shorter sessions get fewer, harder movements.",
      body: (
        <ChoiceGroup
          options={SESSIONS}
          value={answers.sessionLength}
          onChange={(v) => set("sessionLength", v)}
          layout="stack"
          accessibilityLabel="Session length"
        />
      ),
    },
  ];

  const current = STEPS[step];
  const isLast = step === STEP_COUNT - 1;

  return (
    <Screen edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={{ paddingHorizontal: t.space.xl, gap: t.space.base }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: t.space.base,
            }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={12}
              onPress={back}
              style={{ height: t.hitTarget, justifyContent: "center" }}
            >
              <Feather name="arrow-left" size={22} color={t.colors.text} />
            </Pressable>
            <Text variant="label" tone="faint">
              {`Step ${step + 1} of ${STEP_COUNT}`}
            </Text>
          </View>

          <ProgressBar
            value={(step + 1) / STEP_COUNT}
            label={`Step ${step + 1} of ${STEP_COUNT}`}
          />
        </View>

        <ScrollView
          contentContainerStyle={{
            padding: t.space.xl,
            paddingBottom: t.space.xxl,
            gap: t.space.xl,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ gap: t.space.sm }}>
            <Text variant="h1">{current.title}</Text>
            <Text variant="small" tone="muted">
              {current.hint}
            </Text>
          </View>

          {current.body}
        </ScrollView>

        <View
          style={{
            paddingHorizontal: t.space.xl,
            paddingTop: t.space.md,
            paddingBottom: t.space.base,
            borderTopWidth: 1,
            borderTopColor: t.colors.border,
            backgroundColor: t.colors.background,
          }}
        >
          <Button
            label={isLast ? "See my plan" : "Continue"}
            size="lg"
            fullWidth
            disabled={!stepValid}
            onPress={() => (isLast ? finish() : setStep((s) => s + 1))}
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

/** Label with an inline unit switch, e.g. Weight [lb|kg]. */
function UnitRow<T extends string>({
  label,
  unit,
  options,
  onChange,
}: {
  label: string;
  unit: T;
  options: readonly T[];
  onChange: (next: T) => void;
}) {
  const t = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Text variant="label" tone="muted">
        {label}
      </Text>

      <View
        style={{
          flexDirection: "row",
          backgroundColor: t.colors.surfaceAlt,
          borderRadius: t.radius.pill,
          padding: 3,
        }}
      >
        {options.map((option) => {
          const active = option === unit;
          return (
            <Pressable
              key={option}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`Use ${option}`}
              hitSlop={8}
              onPress={() => onChange(option)}
              style={{
                paddingHorizontal: t.space.base,
                paddingVertical: 6,
                borderRadius: t.radius.pill,
                backgroundColor: active ? t.colors.primary : "transparent",
              }}
            >
              <Text
                variant="caption"
                tone={active ? "onPrimary" : "muted"}
                style={{ fontFamily: t.type.smallStrong.fontFamily }}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
