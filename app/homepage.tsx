import { Colors } from "@/constants/color";
import { auth, db } from "@/firebase/config";
import {
  loadCurrentWorkout,
  saveWorkout,
} from "@/services/workoutGenerator/workoutServices";
import { Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
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
      } else if (workoutDays == "4+") {
        setSplitName("Push Pull Legs");
      }
      return workoutWeekA;
    };
    checkandLoadWorkout();
  }, []);

  const day = currentWorkout?.workoutDays;
  const weekA = currentWorkout?.workoutWeekA;
  const weekB = currentWorkout?.workoutWeekB;

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
            <View style={{flex: 1,flexDirection: "row",gap:5}}>
              <Text>Your Workouts:</Text>
              <Text style={styles.workoutHeader}>
                {currentWorkout ? splitName : "not loaded"}
              </Text>
            </View>

            <View>
              <Pressable
                style={styles.startWorkoutButton}
                onPress={() => router.push("/workoutLogging")}
              >
                <Text
                  style={{ fontFamily: "Poppins_700Bold", color: Colors.white }}
                >
                  {" "}
                  Start Workout{" "}
                </Text>
              </Pressable>
            </View>
          </View>
          {day === "2" && (
            <>
              <View style={styles.workoutRoutineA}>
                <Text style={styles.workoutRoutineHeader}>
                  Full Body Day A:
                </Text>
                {weekA?.dayA.map((exercise: any, index: any) => (
                  <Text key={index} style={styles.exerciseText}>
                    {exercise.name}: {exercise.sets} x {reps}
                  </Text>
                ))}
              </View>

              <View style={styles.workoutRoutineB}>
                <Text style={styles.workoutRoutineHeader}>
                  Full Body Day B:
                </Text>
                {weekA?.dayB.map((exercise: any, index: any) => (
                  <Text key={index} style={styles.exerciseText}>
                    {exercise.name}: {exercise.sets} x {reps}
                  </Text>
                ))}
              </View>
            </>
          )}

          {day === "3-4" && (
            <>
              <View style={styles.workoutRoutineA}>
                <Text style={styles.workoutRoutineHeader}>Upper A:</Text>
                {weekA?.upperA.map((exercise: any, index: any) => (
                  <Text key={index} style={styles.exerciseText}>
                    {exercise.name}: {exercise.sets} x {reps} {"\n"}
                  </Text>
                ))}
              </View>
              <View style={styles.workoutRoutineA}>
                <Text style={styles.workoutRoutineHeader}>Lower A:</Text>
                {weekA?.lowerA.map((exercise: any, index: any) => (
                  <Text key={index} style={styles.exerciseText}>
                    {exercise.name}: {exercise.sets} x {reps} {"\n"}
                  </Text>
                ))}
              </View>

              <View style={styles.workoutRoutineB}>
                <Text style={styles.workoutRoutineHeader}>Upper B:</Text>
                {weekA?.upperB.map((exercise: any, index: any) => (
                  <Text key={index} style={styles.exerciseText}>
                    {exercise.name}: {exercise.sets} x {reps} {"\n"}
                  </Text>
                ))}
              </View>

              <View style={styles.workoutRoutineB}>
                <Text style={styles.workoutRoutineHeader}>Lower B:</Text>
                {weekA?.lowerB.map((exercise: any, index: any) => (
                  <Text key={index} style={styles.exerciseText}>
                    {exercise.name}: {exercise.sets} x {reps} {"\n"}
                  </Text>
                ))}
              </View>
            </>
          )}

          {day === "4" && (
            <>
              <View style={styles.workoutRoutineA}>
                <Text style={styles.workoutRoutineHeader}>Push A:</Text>
                {weekA?.pushA.map((exercise: any, index: any) => (
                  <Text key={index} style={styles.exerciseText}>
                    {exercise.name}: {exercise.sets} x {reps} {"\n"}
                  </Text>
                ))}
              </View>
              <View style={styles.workoutRoutineA}>
                <Text style={styles.workoutRoutineHeader}>Pull A:</Text>
                {weekA?.pullA.map((exercise: any, index: any) => (
                  <Text key={index} style={styles.exerciseText}>
                    {exercise.name}: {exercise.sets} x {reps} {"\n"}
                  </Text>
                ))}
              </View>

              <View style={styles.workoutRoutineA}>
                <Text style={styles.workoutRoutineHeader}>Legs A:</Text>
                {weekA?.legsA.map((exercise: any, index: any) => (
                  <Text key={index} style={styles.exerciseText}>
                    {exercise.name}: {exercise.sets} x {reps} {"\n"}
                  </Text>
                ))}
              </View>

              <View style={styles.workoutRoutineB}>
                <Text style={styles.workoutRoutineHeader}>Push B:</Text>
                {weekA?.pushB.map((exercise: any, index: any) => (
                  <Text key={index} style={styles.exerciseText}>
                    {exercise.name}: {exercise.sets} x {reps} {"\n"}
                  </Text>
                ))}
              </View>

              <View style={styles.workoutRoutineB}>
                <Text style={styles.workoutRoutineHeader}>Pull B:</Text>
                {weekA?.pullB.map((exercise: any, index: any) => (
                  <Text key={index} style={styles.exerciseText}>
                    {exercise.name}: {exercise.sets} x {reps} {"\n"}
                  </Text>
                ))}
              </View>

              <View style={styles.workoutRoutineB}>
                <Text style={styles.workoutRoutineHeader}>Legs B:</Text>
                {weekA?.legsB.map((exercise: any, index: any) => (
                  <Text key={index} style={styles.exerciseText}>
                    {exercise.name}: {exercise.sets} x {reps} {"\n"}
                  </Text>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.navBar}></View>
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
    justifyContent: "center",
    alignItems: "center",
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
    paddingHorizontal: 10,
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
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  workoutRoutineHeader: {
    marginVertical: 10,
    color: Colors.primary,
  },

  workoutRoutineA: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 10,
    marginBottom: 15,
  },
  workoutRoutineB: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginHorizontal: 10,
    marginBottom: 15,
  },
  exerciseText: {
    marginBottom: 5,
  },
  startWorkoutButton: {
    borderWidth: 8,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    borderColor: Colors.primary,
  },
});
