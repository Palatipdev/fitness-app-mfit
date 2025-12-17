import { Colors } from "@/constants/color";
import { Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
import Feather from "@expo/vector-icons/Feather";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function workoutLogging() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [exercises, setExercises] = useState<any[]>([]);
  const [currentWeight, setCurrentWeight] = useState("");
  const [currentRep, setCurrentRep] = useState("");
  const [workoutLog, setWorkoutLog] = useState<
    {
      exerciseIndex: number;
      sets: { weight: string; reps: string }[];
    }[]
  >([]);

  const [fontLoaded] = useFonts({
    Poppins_700Bold,
  });

  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const handleAddSet = (exerciseIndex: number) => {
    // check the current set of that exercise index
    // add the current set, weight and reps to that exercise index, this is already updated in currentWeight and currentReps
    const newLog = [...workoutLog];

    if (!newLog[exerciseIndex]) {
      newLog[exerciseIndex] = {
        exerciseIndex: exerciseIndex,
        sets: [],
      };
    }

    newLog[exerciseIndex].sets.push({
      weight: currentWeight,
      reps: currentRep,
    });

    setWorkoutLog(newLog);

    setCurrentWeight("");
    setCurrentRep("");
  };

  useEffect(() => {
    if (params.exercises) {
      setExercises(JSON.parse(params.exercises as string));
    }
  }, []);
  useEffect(() => {
    setIsRunning(true);
  }, []);
  useEffect(() => {
    let interval: any;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const timeString = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")} `;
  if (!fontLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.titleLogoFont} allowFontScaling={true}>
              mfit.
            </Text>
          </View>
          <View>
            <Text style={{ fontFamily: "Popins_700Bold", fontSize: 18 }}>
              Workout:
            </Text>
            <Text style={{ fontFamily: "Popins_700Bold", fontSize: 18 }}>
              {timeString}
            </Text>
          </View>
          <View>
            <TouchableOpacity onPress={() => router.push("/homepage")}>
              <Text
                style={{
                  fontFamily: "Poppins_700Bold",
                  color: Colors.primary,
                  fontSize: 18,
                }}
              >
                Finish
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.workouts}>
          {exercises?.map((exercise: any, index: any) => (
            <View key={index}>
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseText}>{exercise.name}</Text>
                <TouchableOpacity onPress={() => handleAddSet(index)}>
                  <Feather name="plus-circle" size={24} color="black" />
                </TouchableOpacity>
              </View>
              <View style={styles.inputField}>
                <TextInput
                  style={styles.inputBox}
                  placeholder="Weight (lbs)"
                  keyboardType="default"
                  onChangeText={(text) => {
                    const numbersOnly = text.replace(/[^0-9]/g, "");
                    setCurrentWeight(numbersOnly);
                  }}
                />
                <TextInput
                  style={styles.inputBox}
                  placeholder="Reps"
                  keyboardType="default"
                  onChangeText={(text) => {
                    const numbersOnly = text.replace(/[^0-9]/g, "");
                    setCurrentRep(numbersOnly);
                  }}
                />
              </View>
              <View style={styles.setHeader}>
                <Text>SET</Text>
                <Text>WEIGHT</Text>
                <Text>REPS</Text>
              </View>

              {workoutLog[index]?.sets.map((set, setIndex) => (
                <View key = {setIndex} style={styles.setRow}>
                  <Text>{setIndex + 1}</Text>
                  <Text>{set.weight}</Text>
                  <Text>{set.reps}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
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
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: Colors.gray,
    borderBottomWidth: 1,
  },
  titleLogoFont: {
    fontSize: 30,
    color: Colors.primary,
    fontFamily: "Poppins_700Bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  workouts: {
    alignContent: "center",
    justifyContent: "center",
  },
  exerciseText: {
    fontFamily: "Poppins_700Bold",
    paddingHorizontal: 18,
    fontSize: 15,
  },
  inputBox: {
    fontFamily: "Poppins_700Bold",
  },
  exerciseHeader: {
    flexDirection: "row",
    paddingTop: 50,
    marginBottom: 10,
  },

  inputField: {
    flexDirection: "row",
    paddingHorizontal: 18,
    gap: 20,
    paddingBottom: 10,
    borderBottomColor: Colors.gray,
    borderBottomWidth: 1,
  },
  setHeader: {
    gap: 50,
    flexDirection: "row",
    marginTop: 10,
    paddingHorizontal: 18,
    paddingBottom: 100,
  },
});
