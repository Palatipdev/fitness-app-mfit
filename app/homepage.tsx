import { WorkoutDay } from "@/components/workoutDay";
import { Colors } from "@/constants/color";
import { auth, db } from "@/firebase/config";
import {
  loadCurrentWorkout,
  saveWorkout,
} from "@/services/workoutGenerator/workoutServices";
import { getWeek } from "@/utils/fetchData";
import {
  Poppins_700Bold,
  Poppins_500Medium,
  useFonts,
} from "@expo-google-fonts/poppins";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Homepage() {
  const router = useRouter();
  const [fontLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_500Medium,
  });
  const reps = 8;
  const [currentWorkout, setCurrentWorkout] = useState<{
    workoutWeekA: any;
    workoutWeekB: any;
    workoutDays: string;
  } | null>(null);
  const [splitName, setSplitName] = useState("");
  const [currentWeek, setCurrentWeek] = useState<"A" | "B" | null>(null);
  // checking if user is current logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/");
      }
    });
    return unsubscribe;
  }, []);

  //checking if a workout is there, if not generate
  //need to check if firestore exists
  useEffect(() => {
    const checkandLoadWorkout = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.log("not logged in");
        return;
      }
      const userDoc = await getDoc(
        doc(db, "users", currentUser?.uid, "workout", "current"),
      );

      if (!userDoc.exists()) {
        await saveWorkout();
      }
      const { workoutWeekA, workoutWeekB, workoutDays } =
        await loadCurrentWorkout();
      console.log({ workoutWeekA, workoutWeekB, workoutDays });
      setCurrentWorkout({ workoutWeekA, workoutWeekB, workoutDays });
      if (workoutDays == "2") {
        setSplitName("Full Body");
      } else if (workoutDays == "3-4") {
        setSplitName("Upper Lower");
      } else if (workoutDays == "4") {
        setSplitName("Push Pull Legs");
      }
      return workoutWeekA;
    };
    checkandLoadWorkout();
  }, []);

  const day = currentWorkout?.workoutDays;
  const weekA = currentWorkout?.workoutWeekA;
  const weekB = currentWorkout?.workoutWeekB;

  useEffect(() => {
    const getCurrentWeek = async () => {
      const week = await getWeek();
      setCurrentWeek(week);
    };
    getCurrentWeek();
  }, []);

  if (!fontLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContent}>
        {/* Logo */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.titleLogoFont} allowFontScaling={true}>
              mfit.
            </Text>
          </View>
        </View>

        {/* Workout routine */}
        <View style={styles.middleBar}>
          <View style={styles.workoutArea}>
            <View style={{ flexDirection: "row", gap: 5, marginLeft: 20 }}>
              <Text style={{ fontSize: 16, fontFamily: "Poppins_500Medium" }}>
                Your Workouts:
              </Text>
              <Text style={styles.workoutHeader}>
                {currentWorkout ? splitName : "not loaded"}
              </Text>
            </View>

            <View style={{ flexDirection: "row", gap: 5, marginLeft: 20 }}>
              <Text style={{ fontSize: 16, fontFamily: "Poppins_500Medium" }}>
                Current Week:
              </Text>
              <Text style={styles.workoutHeader}>{currentWeek}</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomBar}>
          {day === "2" && (
            <>
              {currentWeek === "A" && (
                <>
                  <WorkoutDay
                    title="Full Body Day A"
                    exercises={weekA?.dayA}
                    dayName="Full Body Day A"
                  />
                  <WorkoutDay
                    title="Full Body Day B"
                    exercises={weekA?.dayB}
                    dayName="Full Body Day B"
                  />
                </>
              )}

              {currentWeek === "B" && (
                <>
                  <WorkoutDay
                    title="Full Body Day A"
                    exercises={weekB?.dayA}
                    dayName="Full Body Day A"
                  />
                  <WorkoutDay
                    title="Full Body Day B"
                    exercises={weekB?.dayB}
                    dayName="Full Body Day B"
                  />
                </>
              )}
            </>
          )}

          {day === "3-4" && (
            <>
              {currentWeek === "A" && (
                <>
                  <WorkoutDay
                    title="Upper A"
                    exercises={weekA?.upperA}
                    dayName="Upper A"
                  />
                  <WorkoutDay
                    title="Lower A"
                    exercises={weekA?.lowerA}
                    dayName="Lower A"
                  />
                  <WorkoutDay
                    title="Upper B"
                    exercises={weekA?.upperB}
                    dayName="Upper B"
                  />
                  <WorkoutDay
                    title="Lower B"
                    exercises={weekA?.lowerB}
                    dayName="Lower B"
                  />
                </>
              )}

              {currentWeek === "B" && (
                <>
                  <WorkoutDay
                    title="Upper A"
                    exercises={weekB?.upperA}
                    dayName="Upper A"
                  />
                  <WorkoutDay
                    title="Lower A"
                    exercises={weekB?.lowerA}
                    dayName="Lower A"
                  />
                  <WorkoutDay
                    title="Upper B"
                    exercises={weekB?.upperB}
                    dayName="Upper B"
                  />
                  <WorkoutDay
                    title="Lower B"
                    exercises={weekB?.lowerB}
                    dayName="Lower B"
                  />
                </>
              )}
            </>
          )}

          {day === "4" && (
            <>
              {currentWeek === "A" && (
                <>
                  <WorkoutDay
                    title="Push A"
                    exercises={weekA?.pushA}
                    dayName="Push A"
                  />
                  <WorkoutDay
                    title="Pull A"
                    exercises={weekA?.pullA}
                    dayName="Pull A"
                  />
                  <WorkoutDay
                    title="Legs A"
                    exercises={weekA?.legsA}
                    dayName="Legs A"
                  />
                  <WorkoutDay
                    title="Push B"
                    exercises={weekA?.pushB}
                    dayName="Push B"
                  />
                  <WorkoutDay
                    title="Pull B"
                    exercises={weekA?.pullB}
                    dayName="Pull B"
                  />
                  <WorkoutDay
                    title="Legs B"
                    exercises={weekA?.legsB}
                    dayName="Legs B"
                  />
                </>
              )}

              {currentWeek === "B" && (
                <>
                  <WorkoutDay
                    title="Push A"
                    exercises={weekB?.pushA}
                    dayName="Push A"
                  />
                  <WorkoutDay
                    title="Pull A"
                    exercises={weekB?.pullA}
                    dayName="Pull A"
                  />
                  <WorkoutDay
                    title="Legs A"
                    exercises={weekB?.legsA}
                    dayName="Legs A"
                  />
                  <WorkoutDay
                    title="Push B"
                    exercises={weekB?.pushB}
                    dayName="Push B"
                  />
                  <WorkoutDay
                    title="Pull B"
                    exercises={weekB?.pullB}
                    dayName="Pull B"
                  />
                  <WorkoutDay
                    title="Legs B"
                    exercises={weekB?.legsB}
                    dayName="Legs B"
                  />
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.navBar}>
        <Pressable onPress={() => router.push("/homepage")}>
          <Feather name="home" size={24} color="black" />
        </Pressable>
        <Pressable onPress={() => router.push("/progressAnalytics")}>
          <Feather name="book" size={24} color="black" />
        </Pressable>
        <Pressable onPress={() => router.push("/profilePage")}>
          <FontAwesome name="user-circle" size={24} color="grey" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 20,
    alignItems: "flex-start",
  },
  middleTop: {
    paddingTop: 10,
    paddingHorizontal: 80,
    flex: 1,
  },

  titleLogoFont: {
    fontSize: 30,
    color: Colors.primary,
    fontFamily: "Poppins_700Bold",
  },

  middleBar: {
    borderTopColor: Colors.border,
    borderTopWidth: 2,
    marginTop: 10,
  },
  bottomBar: {
    backgroundColor: "#F5F5F5",
  },
  workoutArea: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.black,
    marginTop: 5,
  },
  workoutHeader: {
    marginBottom: 5,
    fontFamily: "Poppins_700Bold",
    color: Colors.primary,
    fontSize: 16,
  },

  navBar: {
    height: 30,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 50,
    flexDirection: "row",
    gap: 100,
    paddingTop: 5,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
