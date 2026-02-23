import { Colors } from "@/constants/color";
import { fetchPastWorkouts } from "@/services/workoutAnalytic/fetchingServices";
import { formatDate } from "@/services/workoutAnalytic/formatDate";
import {
  Poppins_500Medium,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";

// Fetch user's past workouts
// Display them in a list
// Tap to expand
// Show exercises + sets

export default function progressAnalytics() {
  const router = useRouter();
  const [workoutHistory, setWorkoutHistory] = useState<any[]>([]);
  const [fontLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_700Bold,
  });
  const [expandedWorkout, setExpandedWorkout] = useState<{
    [key: string]: boolean;
  }>({});

  const [workoutProgress, setWorkoutProgress] = useState<any[]>([]);
  const [progressExpanded, setProgressExpanded] = useState(false);

  useEffect(() => {
    const pastworkoutsFunction = async () => {
      const pastWorkouts = await fetchPastWorkouts();
      if (!pastWorkouts) {
        //show a screen saying start logging your workout to see your progress!
      } else {
        setWorkoutHistory(pastWorkouts);
      }
    };
    pastworkoutsFunction();
  }, []);

  const toggleWorkout = (workoutId: string) => {
    setExpandedWorkout({
      ...expandedWorkout,
      [workoutId]: !expandedWorkout[workoutId],
    });
  };

  const getHeaviestSet = (workout: any) => {
    let results = [];

    if (workout.workout) {
      for (const exercise of workout.workout) {
        let heaviestWeight = 0;
        let heaviestWeightReps = 0;
        let heaviestSet = null;
        for (const set of exercise.sets) {
          const weight = parseInt(set.weight);
          if (weight > heaviestWeight) {
            heaviestWeight = weight;
            heaviestWeightReps = parseInt(set.reps);
            heaviestSet = set;
          } else if (weight === heaviestWeight) {
            if (parseInt(set.reps) > heaviestWeightReps) {
              heaviestSet = set;
            }
          }
        }
        if (heaviestSet) {
          results.push({
            exerciseIndex: exercise.exerciseIndex,
            exerciseName: exercise.exerciseName,
            primaryMuscleGroup: exercise.primaryMuscleGroup,
            ...heaviestSet,
          });
        } else {
          results.push(null);
        }
      }
    }
    return results;
  };

  const get1RM = (weight: number, reps: number) => {
    return weight * (1 + reps / 30);
  };

  const getMuscleGroupStrength = (workout: any) => {
    let results: { [key: string]: number } = {};
    let heaviestArr = getHeaviestSet(workout);

    for (const exercise of heaviestArr) {
      if (!exercise) {
        continue;
      }
      let current1RM = get1RM(
        parseInt(exercise.weight),
        parseInt(exercise.reps),
      );

      if (Object.hasOwn(results, exercise.primaryMuscleGroup)) {
        results[exercise.primaryMuscleGroup] += current1RM;
      } else {
        results[exercise.primaryMuscleGroup] = current1RM;
      }
    }

    return results;
  };

  const calculateMuscleGroupProgress = (workoutHistory: any) => {
    let results: { [key: string]: { sum: number; count: number } } = {};

    console.log("Total workouts:", workoutHistory.length);
    console.log(
      "All dayNames:",
      workoutHistory.map((w: any) => w.dayName),
    );
    const workoutTypes = [
      "Full Body Day A",
      "Full Body Day B",
      "Upper A",
      "Upper B",
      "Lower A",
      "Lower B",
      "Push A",
      "Push B",
      "Pull A",
      "Pull B",
      "Legs A",
      "Legs B",
    ];
    let averages: { [key: string]: number } = {};

    for (const type of workoutTypes) {
      const filtered = workoutHistory.filter((w: { dayName: string }) =>
        w.dayName.includes(type),
      );

      if (filtered.length >= 2) {
        const current = getMuscleGroupStrength(filtered[filtered.length - 1]);
        const first = getMuscleGroupStrength(filtered[0]);

        for (const item in current) {
          if (first[item]) {
            const improvement =
              ((current[item] - first[item]) / first[item]) * 100;

            if (results[item]) {
              results[item].sum += improvement;
              results[item].count += 1;
            } else {
              results[item] = { sum: improvement, count: 1 };
            }
          }
        }
      }
    }
    for (const item in results) {
      averages[item] =
        Math.round((results[item].sum / results[item].count) * 10) / 10;
    }
    return averages;
  };

  const displayProgress = (averages: { [key: string]: number }) => {
    const sortedArray = Object.entries(averages);

    sortedArray.sort(([, a], [, b]) => b - a);
    console.log(sortedArray);
    setWorkoutProgress(sortedArray);
  };

  useEffect(() => {
    if (workoutHistory.length > 0) {
      const progress = calculateMuscleGroupProgress(workoutHistory);
      console.log("Progress:", progress);
      displayProgress(progress);
    }
  }, [workoutHistory]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.titleLogoFont} allowFontScaling={true}>
            mfit.
          </Text>
        </View>
      </View>
      {/* Progress section */}
      <View style={styles.middleBar}>
        <View style={styles.chartBox}>
          <Pressable onPress={() => setProgressExpanded(!progressExpanded)}>
            <Text
              style={{
                fontFamily: "Poppins_700Bold",
                fontSize: 20,
                marginBottom: 10,
              }}
            >
              Strength Increased:
            </Text>

            {workoutProgress[0] && (
              <Text style={styles.progressText}>
                {" "}
                {`${workoutProgress[0][0]} - ${workoutProgress[0][1]}%`}{" "}
              </Text>
            )}

            {progressExpanded &&
              workoutProgress.slice(1).map((item: any, index: any) => (
                <Text key={index} style={styles.progressText}>
                  {" "}
                  {`${item[0]} - ${item[1]}%`}
                </Text>
              ))}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 3,
                alignSelf: "flex-end",
              }}
            >
              <Text style={{ fontFamily: "Poppins_500Medium", fontSize: 14 }}>
                {progressExpanded ? "Collapse" : "Expand"}
              </Text>
              <AntDesign
                name={progressExpanded ? "up" : "down"}
                size={14}
                color={"black"}
              />
            </View>
          </Pressable>
        </View>
      </View>

      {/* Workout History Section */}
      <View style={styles.bottomBar}>
        <ScrollView style={styles.progressHistory}>
          <Text
            style={{
              fontFamily: "Poppins_700Bold",
              fontSize: 16,
              marginBottom: 20,
              color: Colors.primary,
            }}
          >
            Workout History:
          </Text>
          {workoutHistory?.map((workout: any, index: any) => (
            <Pressable
              key={workout.id}
              onPress={() => toggleWorkout(workout.id)}
            >
              <View style={styles.workoutCard}>
                <Text style={styles.workoutText}>
                  {`${workout.dayName} - ${formatDate(workout.date)}`}
                </Text>

                <View style={styles.expandedInfo}>
                  {expandedWorkout[workout.id] &&
                    getHeaviestSet(workout).map((set, setIndex) => (
                      <Text key={setIndex}>
                        {set
                          ? `${set.exerciseName} : ${set.weight} x ${set.reps}`
                          : null}
                      </Text>
                    ))}
                </View>
                <AntDesign
                  name={expandedWorkout[workout.id] ? "up" : "down"}
                  size={16}
                  color={"black"}
                  style={{ alignSelf: "flex-end" }}
                />
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>

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
  topBar: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 20,
    alignItems: "flex-start",
  },
  titleLogoFont: {
    fontSize: 30,
    color: Colors.primary,
    fontFamily: "Poppins_700Bold",
  },
  middleBar: {
    paddingVertical: 20,
    alignItems: "center",
  },
  chartBox: {
    padding: 20,
    borderWidth: 1.9,
    borderRadius: 20,
    borderColor: Colors.border,
    minWidth: "80%",
  },
  progressText: {
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    marginVertical: 5,
  },
  bottomBar: {
    flex: 1, // Takes remaining space
    backgroundColor: "#fafafa",
    padding: 20,
  },
  progressHistory: {
    flex: 1,
  },
  workoutCard: {
    backgroundColor: Colors.white,
    borderRadius: 30,
    padding: 15,
    marginBottom: 15,
  },
  workoutText: {
    fontSize: 18,
    fontFamily: "Poppins_500Medium",
    marginBottom: 5,
  },
  expandedInfo: {
    marginLeft: 15,
    marginBottom: 15,
    gap: 5,
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
});
