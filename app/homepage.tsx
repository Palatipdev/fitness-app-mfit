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
  const [currentWorkout, setCurrentWorkout] = useState(null);

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
      if (!currentUser){
        console.log("not logged in")
        return;
      }
      const userDoc = await getDoc(
        doc(db, "users", currentUser?.uid, "workout", "current")
      );
    
    if (!userDoc.exists()) {
      saveWorkout();
    } else {
      loadCurrentWorkout();
    }
  }
  checkandLoadWorkout()
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
            <Text style={styles.workoutHeader}>Your Workouts:</Text>
            <Text>
              Monday - Upper Push{"\n"}• Bench Press 4×8-10{"\n"}• Overhead
              Press 3×10-12{"\n"}• Incline Dumbbell Press 3×10-12{"\n"}• Lateral
              Raises 3×12-15{"\n"}• Tricep Dips 3×12-15{"\n"}• Tricep Pushdowns
              3×15
              {"\n"}
              Tuesday - Lower (Quad Focus){"\n"}• Squats 4×8-10{"\n"}• Leg Press
              3×12-15{"\n"}• Lunges 3×10 each leg{"\n"}• Leg Extensions 3×12-15
              {"\n"}• Calf Raises 4×15-20{"\n"}
              Wednesday - Rest{"\n"}• Thursday - Upper Pull{"\n"}• Deadlifts
              4×6-8
              {"\n"}• Pull-ups 3×8-12{"\n"}• Barbell Rows 3×10-12{"\n"}• Face
              Pulls 3×15{"\n"}• Bicep Curls 3×12-15{"\n"}• Hammer Curls 3×12-15
              {"\n"}
              Friday - Lower (Hamstring/Glute Focus){"\n"}• Romanian Deadlifts
              4×8-10{"\n"}• Hip Thrusts 3×12-15{"\n"}• Leg Curls 3×12-15{"\n"}•
              Bulgarian Split Squats 3×10 each leg{"\n"}• Calf Raises 4×15-20
              {"\n"}
              Saturday - Rest{"\n"}
              Sunday - Rest{"\n"}
            </Text>
          </View>
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
    height: 600,
    borderTopColor: Colors.border,
    borderTopWidth: 2,
    marginTop: 10,
  },
  workoutArea: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  workoutHeader: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.black,
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
});
