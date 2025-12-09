import { Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
import AntDesign from "@expo/vector-icons/AntDesign";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { Colors } from "../constants/color";
// setting param
import { useLocalSearchParams } from "expo-router";

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ResultPreview() {
  const params = useLocalSearchParams();
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
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <AntDesign name="arrow-left" size={24} color={Colors.primary} />
          <Text style={styles.appFont}>Back</Text>
        </Pressable>
      </View>
      <View style={styles.middleBar}>
        <Text style={[styles.appFont, { fontSize: 20 }]}> We've created a custom workout plan based on your goals!</Text>

        <View style={styles.previewContainer}>
          <View style={styles.planPreview}>
            {/* Summary badges */}

            <View style={styles.summaryRow}>
              <Text style={styles.badge}>4 Days/Week</Text>
              <Text style={styles.badge}>60 Minutes</Text>
            </View>

            {/* Workout preview */}
            <Text style={styles.sectionTitle}>Your Training Split:</Text>
            <Text style={styles.planText}>
              <Text style={styles.dayTitle}>Monday - Upper Push{'\n'}</Text>
              • Bench Press: 4×8-10{'\n'}
              • Overhead Press: 3×10-12{'\n'}
              • Incline Dumbbell Press: 3×10-12{'\n'}
              • Tricep Dips: 3×12-15{'\n'}

              <Text style={styles.dayTitle}>Tuesday - Rest</Text>
              {'\n'}

            </Text>
            {/* Fade gradient */}
            <LinearGradient
              colors={['transparent', 'rgba(255,255,255,0.9)', 'white']}
              locations={[0, 0.5, 1]}
              style={styles.fadeOverlay1}
            />
            {/* Nutrition preview */}
            <Text style={styles.sectionTitle}>Your Nutrition Plan:</Text>
            <Text style={styles.planText}>
              Daily Calories: 2,800{'\n'}
              Protein: 160g {'\n'}
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
            style={styles.fadeOverlay2}
          />
        </View>
      </View>

      <View style={styles.bottomBar}>
        <Text style={[styles.appFont, { fontSize: 20 }]}></Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push({pathname: '/sign-up', params: params})}>
          <View style={styles.continue}>
            <Text style={[styles.font, { color: Colors.white }, { fontSize: 15 }, { marginTop: 2 }]}>Create an account to see!</Text>
          </View>
        </TouchableOpacity>
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
    width: "100%",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
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
  middleBar: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 15,
    
  },
  previewContainer: {
    alignItems: 'center',
    flex: 1,
    paddingTop: 15,
  },
  planPreview: {
    borderWidth: 2,
    padding: 25,
    borderRadius: 20,
    backgroundColor: Colors.gray,

  },
  summaryRow: {

    marginBottom: 10,
    flexDirection: 'row',
    gap: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.black,
  },

  badge: {
    fontFamily: "Poppins_700Bold",
    fontSize: 15,
  },
  sectionTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    marginTop: 10,
    color: Colors.primary,
  },
  dayTitle: {
    fontFamily: "Poppins_700Bold",
  },

  bottomBar: {
    alignItems: 'center',
    height: '20%',
    paddingTop: 30,
    gap: 10,
  },
  continue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  planText: {
    fontSize: 13,
    lineHeight: 24,
    color: '#666',
  },
  font: {
    fontFamily: "Poppins_700Bold",
    fontSize: 10,
  },
  fadeOverlay1: {
    position: 'absolute',
    bottom: 250,
    left: 0,
    right: 0,
    height: 300,
    pointerEvents: 'none',
  },
    fadeOverlay2: {
    position: 'absolute',
    bottom: -70,
    left: 0,
    right: 0,
    height: 200,
    pointerEvents: 'none',
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
