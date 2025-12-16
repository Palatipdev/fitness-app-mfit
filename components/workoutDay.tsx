import { Colors } from "@/constants/color";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function WorkoutDay({ 
  title, 
  exercises, 
  dayName 
}: { 
  title: string;
  exercises: any[];
  dayName: string;
}) {
  const router = useRouter();
  const reps = 8;

  return (
    <View style={styles.workoutRoutine}>
      <View style={styles.dayHeader}>
        <Text style={styles.workoutRoutineHeader}>{title} :</Text>
        <Pressable
          style={styles.startWorkoutButton}
          onPress={() =>
            router.push({
              pathname: "/workoutLogging",
              params: {
                exercises: JSON.stringify(exercises),
                dayName: dayName,
              },
            })
          }
        >
          <Text style={styles.buttonText}>Start Workout</Text>
        </Pressable>
      </View>
      {exercises?.map((exercise: any, index: any) => (
        <Text key={index} style={styles.exerciseText}>
          {exercise.name}: {exercise.sets} x {reps}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  workoutRoutine: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 10,
    marginBottom: 15,
  },
  dayHeader: {
    flexDirection: "row",
    gap: 7,
  },
  workoutRoutineHeader: {
    marginVertical: 10,
    color: Colors.primary,
    fontFamily: "Poppins_700Bold",
  },
  startWorkoutButton: {
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: "Poppins_700Bold",
    color: Colors.primary,
    fontSize: 14,
  },
  exerciseText: {
    marginBottom: 5,
  },
});