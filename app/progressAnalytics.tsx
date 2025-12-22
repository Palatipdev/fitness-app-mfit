import { Colors } from "@/constants/color";
import { fetchPastWorkouts } from "@/services/workoutAnalytic/fetchingServices";
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
  const [workoutHistory,setWorkoutHistory] = useState<any[]> ([])

  useEffect(() => {
    const pastworkoutsFunction = async () => {
      const pastWorkouts = await fetchPastWorkouts();
      if (!pastWorkouts) {
        //show a screen saying start logging your workout to see your progress!
      }
      else{
        setWorkoutHistory(pastWorkouts)
      }
    };
     pastworkoutsFunction();
  }, []);

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
            {workoutHistory?.map((workout:any,index:any) => (
                <Pressable >
                    <Text key = {index} style = {styles.workoutText}>
                        {workout.date}
                    </Text>

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
