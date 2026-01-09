import { Colors } from "@/constants/color";
import { fetchPastWorkouts } from "@/services/workoutAnalytic/fetchingServices";
import { formatDate } from "@/services/workoutAnalytic/formatDate";
import {
  Poppins_500Medium,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

  const [workoutProgress, setWorkoutProgress] = useState<any[]>([])
  const [progressExpanded, setProgressExpanded] = useState(false)

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
        parseInt(exercise.reps)
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
      workoutHistory.map((w: any) => w.dayName)
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
        w.dayName.includes(type)
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
      averages[item] = Math.round((results[item].sum / results[item].count) * 10) / 10
    }
    return averages;
  };

  const displayProgress = (averages: {[key:string] : number} ) => {
    const sortedArray = Object.entries(averages)

    sortedArray.sort(([,a],[,b]) => b-a)
    console.log(sortedArray)
    setWorkoutProgress(sortedArray)

  }

  useEffect(() => {
    if (workoutHistory.length > 0) {

      const progress = calculateMuscleGroupProgress(workoutHistory)
      console.log("Progress:", progress)
      displayProgress(progress)
    }
  }, [workoutHistory]);

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        {/* Progress section */}
        <View style={styles.middleBar}>
          <View style={styles.chartBox}>
            <Pressable onPress={() => setProgressExpanded(!progressExpanded)}>
            {workoutProgress[0] &&  (
              <Text style= {styles.progressText}> {`${workoutProgress[0][0]} - ${workoutProgress[0][1]}%`} </Text>
            )}

            {progressExpanded && workoutProgress.slice(1).map((item : any,index : any) => (
              <Text key = {index}> {`${item[0]} - ${item[1]}`}</Text>

            ))}
            </Pressable>
          </View>
        </View>

        {/* Workout History Section */}
        <View style={styles.bottomBar}>
          {workoutHistory?.map((workout: any, index: any) => (
            <Pressable
              key={workout.id}
              onPress={() => toggleWorkout(workout.id)}
            >
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
            </Pressable>
          ))}
        </View>

        <View style={styles.navBar}>
          <Pressable onPress={() => router.push("/homepage")}>
            <Feather name="home" size={24} color="black" />
          </Pressable>
          <Pressable onPress={() => router.push("/progressAnalytics")}>
            <Feather name="book" size={24} color="black" />
          </Pressable>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  middleBar: {
    justifyContent: "center",
    alignItems: "center",
  },
  chartBox: {
    padding: 200,
    borderWidth: 1.9,
    borderRadius: 30,
    borderColor: Colors.border,
    alignItems: "center",
    paddingRight: 150,
    backgroundColor: "red"
  },
  bottomBar: {
    alignItems: "center",
    paddingVertical: 30,
    gap: 20,
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
  workoutText: {
    fontSize: 18,
    fontFamily: "Poppins_500Medium",
    color: Colors.primary,
  },
});
