import { Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { Colors } from "../../constants/color";

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Prompting() {
    const router = useRouter()
  const [fontLoaded] = useFonts({
    Poppins_700Bold,
  });

  if (!fontLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <AntDesign name="arrow-left" size={24} color={Colors.primary} />
          <Text style={styles.appFont}>Back</Text>
        </Pressable>
      </View>
      <View style = {styles.middleBar}>
        <Text style = {[styles.appFont, {fontSize: 20}]}> We've created a custom workout plan based on your goals!</Text>

              <View style={styles.previewContainer}>
        <View style={styles.planPreview}>
          {/* Summary badges */}
          <View style={styles.summaryRow}>
            <Text style={styles.badge}>🎯 Muscle Gain</Text>
            <Text style={styles.badge}>💪 Beginner</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.badge}>📅 4 Days/Week</Text>
            <Text style={styles.badge}>⏱️ 60 Minutes</Text>
          </View>

          {/* Workout preview */}
          <Text style={styles.sectionTitle}>Your Training Split:</Text>
          <Text style={styles.planText}>
            <Text style={styles.dayTitle}>Monday - Upper Push</Text>
            • Bench Press: 4×8-10{'\n'}
            • Overhead Press: 3×10-12
            • Incline Dumbbell Press: 3×10-12
            • Tricep Dips: 3×12-15
            
            <Text style={styles.dayTitle}>Tuesday - Rest</Text>
            {'\n'}
            <Text style={styles.dayTitle}>Wednesday - Lower Body{'\n'}</Text>
            • Squats: 4×8-10{'\n'}
            • Romanian Deadlifts: 3×10-12{'\n'}
            • Leg Press: 3×12-15{'\n'}
            • Leg Curls: 3×12-15{'\n'}
            {'\n'}
            <Text style={styles.dayTitle}>Thursday - Rest{'\n'}</Text>
            {'\n'}
            <Text style={styles.dayTitle}>Friday - Upper Pull{'\n'}</Text>
            • Pull-ups: 4×6-8{'\n'}
            • Barbell Rows: 3×10-12{'\n'}
            • Lat Pulldowns: 3×12-15
          </Text>

          {/* Nutrition preview */}
          <Text style={styles.sectionTitle}>Your Nutrition Plan:</Text>
          <Text style={styles.planText}>
            Daily Calories: 2,800{'\n'}
            Protein: 180g (2g/kg){'\n'}
            Carbs: 350g{'\n'}
            Fats: 80g{'\n'}
            {'\n'}
            Sample Meal Plan:{'\n'}
            Breakfast: Oatmeal with protein...
          </Text>
        </View>

        {/* Fade gradient */}
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.9)', 'white']}
          locations={[0, 0.5, 1]}
          style={styles.fadeOverlay}
        />
      </View>
      </View>

      <View style = {styles.bottomBar}>
        <Text style = {[styles.appFont, {fontSize: 20}]}></Text>
            <TouchableOpacity style = {styles.button} onPress={() => router.push('/(tabs)/sign-up')}>
              <View style = {styles.continue}>
                <Text style = {[styles.font , {color: Colors.white}, {fontSize: 15}, {marginTop: 2}]}>Create an account to see!</Text>
              </View>
            </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  topBar: {
    width: "100%",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: 'red',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
    backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 5,
  },
    appFont: {
    color: Colors.primary,
    fontFamily: "Poppins_700Bold",
  },
  middleBar:{
    backgroundColor: 'blue',
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 50,
  },

  bottomBar:{
    backgroundColor: 'pink',
    flex: 1,
    alignItems: 'center',
    paddingTop: 175,
    gap: 10,
  },
    continue:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

  },
    font:{
    fontFamily: "Poppins_700Bold",
    fontSize: 12
  },
    button: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    borderWidth: 4,
    borderRadius: 30,
    padding: 10,
    width: 250,
    alignItems: "center",
  },
});
