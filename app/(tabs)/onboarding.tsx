import { Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { useState } from "react";

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/color";

export default function OnBoarding() {
  const router = useRouter();
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

  //setting height and weight
  const [userHeight, setHeight] = useState("");
  const [userWeight, setWeight] = useState("");
  const weightNum = parseInt(userWeight);
  const heightNum = parseInt(userHeight);

  //clicking button
  const [selectedGoal, setSelectedGoal] = useState("");
  const [selectedGender, setSelectedGender] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <AntDesign name="arrow-left" size={24} color={Colors.primary} />
          <Text style={styles.appFont}>Back</Text>
        </Pressable>
      </View>

      <View style={styles.questionaire}>
        <Text style={styles.appFont}>What is your goal?</Text>
        <View style={styles.answerButtons}>
          <TouchableOpacity
            style={selectedGoal === "wl" ? styles.pressed : styles.unPressed}
            onPress={() => setSelectedGoal("wl")}
          >
            <Text> Weight Lost</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              selectedGoal === "maintain" ? styles.pressed : styles.unPressed
            }
            onPress={() => setSelectedGoal("maintain")}
          >
            <Text> Maintain</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={selectedGoal === "gain" ? styles.pressed : styles.unPressed}
            onPress={() => setSelectedGoal("gain")}
          >
            <Text> Gain Weight</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.appFont}>What is your height and weight?</Text>
        <View style={styles.heightAndWeight}>
          <View style={styles.heightAndWeightLeft}>
            <TextInput
              style={styles.inputBox}
              placeholder="Weight (lbs)"
              keyboardType="numeric"
              onChangeText={setWeight}
              value={userWeight}
            />
            <TextInput
              style={styles.inputBox}
              placeholder="Height (cm)"
              keyboardType="numeric"
              onChangeText={setHeight}
              value={userHeight}
            />
          </View>
          <View style={styles.heightAndWeightRight}>
            <TouchableOpacity
              style={[
                selectedGender === "male" ? styles.pressed : styles.unPressed,
                { width: 75 },
                { marginRight: 10 },
              ]}
              onPress={() => setSelectedGender("male")}
            >
              <Text>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                selectedGender === "female" ? styles.pressed : styles.unPressed,
                { width: 75 },
              ]}
              onPress={() => setSelectedGender("female")}
            >
              <Text>Female</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
    loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  topBar: {
    width: "100%",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
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

  questionaire: {
    flex: 1,
    width: "100%",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  answerButtons: {
    width: "100%",
    height: "10%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heightAndWeight: {
    width: "100%",
    flexDirection: "row",
  },
  heightAndWeightLeft: {
    flex: 1,
  },
  heightAndWeightRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 20,
  },
  inputBox: {},
  unPressed: {
    borderWidth: 4,
    borderRadius: 30,
    borderColor: Colors.gray,
    backgroundColor: Colors.gray,
    padding: 10,
    width: 120,
    alignItems: "center",
    fontFamily: "Poppins_700Bold",
  },
  pressed: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    borderWidth: 4,
    borderRadius: 30,
    padding: 10,
    width: 120,
    alignItems: "center",
    fontFamily: "Poppins_700Bold",
  },
});
