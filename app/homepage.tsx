import { WorkoutDay } from "@/components/workoutDay";
import { Colors } from "@/constants/color";
import { auth, db } from "@/firebase/config";
import {
  loadCurrentWorkout,
  saveWorkout,
} from "@/services/workoutGenerator/workoutServices";
import { getWeek } from "@/utils/fetchData";
import { Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
import Feather from "@expo/vector-icons/Feather";
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
        doc(db, "users", currentUser?.uid, "workout", "current")
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
          {/* Streak */}
          <View style={styles.middleTop}>
            <Text>2🔥</Text>
          </View>
        </View>

        {/* Nutrient tracker */}
        <View style={styles.middleBar}>
          <View style={styles.nutrientBox}>
            <View style={styles.calories}>
              <Text
                style={{
                  fontFamily: "Poppins_700Bold",
                  fontSize: 30,
                  color: Colors.primary,
                }}
              >
                2100{" "}
              </Text>
              <Text style={{ fontSize: 15, marginTop: 18 }}>
                Calories remaining
              </Text>
            </View>
            <View style={styles.progressBar}>
              {/* progress filled when calories is reached */}
            </View>
          </View>
        </View>

        {/* Workout routine */}
        <View style={styles.bottomBar}>
          <View style={styles.workoutArea}>
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Text>Your Workouts:</Text>
              <Text style={styles.workoutHeader}>
                {currentWorkout ? splitName : "not loaded"}
              </Text>
            </View>

            <View style={{ flexDirection: "row", gap: 5 }}>
              <Text>Current Week:</Text>
              <Text style={styles.workoutHeader}>{currentWeek}</Text>
            </View>
          </View>
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
 
    height: 350,
  },
  nutrientBox: {
    width: "90%",
    height: "85%",
    borderWidth: 1.9,
    borderRadius: 30,
    borderColor: Colors.border,
    alignItems: "flex-end",
    paddingRight: 50,
  },
  calories: {
    paddingTop: 60,
    flexDirection: "row",
  },
  progressBar: {
    marginTop: 10,
    width: "80%",
    height: "10%",
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: 30,
  },
  bottomBar: {
    borderTopColor: Colors.border,
    borderTopWidth: 2,
    marginTop: 10,
    paddingBottom: 20,
  },
  workoutArea: {
    paddingVertical: 5,
    gap: 10,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: Colors.black,
  },
  workoutHeader: {
    marginBottom: 5,
    fontFamily: "Poppins_700Bold",
    color: Colors.primary,
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
