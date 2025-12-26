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
            ...heaviestSet
          });
        } else {
          results.push(null);
        }
      }
    }
    return results;
  };

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        {/* Progress section */}
        <View style={styles.middleBar}>
          <View style={styles.chartBox}>
            <Text>50%</Text>
          </View>
        </View>

        {/* Workout History Section */}
        <View style={styles.bottomBar}>
          {workoutHistory?.map((workout: any, index: any) => (
            <Pressable key = {workout.id}onPress={() => toggleWorkout(workout.id)}>
              <Text  style={styles.workoutText}>
                {`${workout.dayName} - ${formatDate(workout.date)}`}
              </Text>

              <View style={styles.expandedInfo}>
                {expandedWorkout[workout.id] && (
                getHeaviestSet(workout).map((set,setIndex) => (
                  <Text key = {setIndex}>
                    {set ? `${set.exerciseName} : ${set.weight} x ${set.reps}` : null }
                  </Text>
                  
     
                  ))
                )}
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
