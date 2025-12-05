import { Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../constants/color";
export default function OnBoarding() {
  const router = useRouter();
  const [fontLoaded] = useFonts({
    Poppins_700Bold,
  });

  //Entering height, weight and age.
  const [userHeight, setHeight] = useState("");
  const [userWeight, setWeight] = useState("");
  const [age,setAge] = useState("");

  //clicking button
  const [selectedGoal, setSelectedGoal] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedDays, setSelectedDays] = useState("");
  const [selectedSession, setSelectedSession] = useState("");

  const handleContinue = () => {
    // validating the data field
    if (!selectedGoal || !userHeight || !userWeight || ! selectedGender || !selectedDays || ! selectedSession || ! age){
      Alert.alert("Please fill in all fields")
      return;
    }

    // Navigate to results with the data
    router.push({
      pathname: '/(tabs)/resultPreview',
      params: {
        goal : selectedGoal,
        height: userHeight,
        weight: userWeight,
        gender: selectedGender,
        age: age,
        workoutDays: selectedDays,
        sessionLength: selectedSession
      }
    });
    
  };

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

      <View style={styles.questionaire}>
        <Text style={styles.appFont}>What is your goal?</Text>
        <View style={styles.answerButtons}>
          <TouchableOpacity
            style={selectedGoal === "wl" ? styles.pressed : styles.unPressed}
            onPress={() => setSelectedGoal("wl")}
          >
            <Text style={styles.font}> Weight Lost</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              selectedGoal === "maintain" ? styles.pressed : styles.unPressed
            }
            onPress={() => setSelectedGoal("maintain")}
          >
            <Text style={styles.font}> Maintain</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={selectedGoal === "gain" ? styles.pressed : styles.unPressed}
            onPress={() => setSelectedGoal("gain")}
          >
            <Text style={styles.font}> Gain Weight</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.appFont}>What is your height and weight?</Text>
        <View style={styles.heightAndWeight}>
          <View style={styles.heightAndWeightLeft}>
            <TextInput
              style={styles.inputBox}
              placeholder="Weight (lbs)"
              keyboardType="default"
              onChangeText={(text) => {
                const numbersOnly = text.replace(/[^0-9]/g, "");
                setWeight(numbersOnly);
              }}
              value={userWeight}
            />
            <TextInput
              style={styles.inputBox}
              placeholder="Height (cm)"
              keyboardType="default"
              onChangeText={(text) => {
                const numbersOnly = text.replace(/[^0-9]/g, "");
                setHeight(numbersOnly);
              }}
              value={userHeight}
            />
          </View>
          <View style={styles.heightAndWeightRight}>
            <TouchableOpacity
              style={[
                selectedGender === "male" ? styles.pressed : styles.unPressed,
                { width: 85 },
                { marginRight: 10 },
              ]}
              onPress={() => setSelectedGender("male")}
            >
              <Text style={styles.font}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                selectedGender === "female" ? styles.pressed : styles.unPressed,
                { width: 85 },
              ]}
              onPress={() => setSelectedGender("female")}
            >
              <Text style={styles.font}>Female</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={[styles.appFont, { paddingTop: 10 }]}>
          How old are you?
        </Text>
        <View style ={styles.ageBox}>
        <TextInput
          style={[styles.inputBox]}
          placeholder="Age"
          keyboardType="default"
          onChangeText={(text) => {
            const numbersOnly = text.replace(/[^0-9]/g, "");
            setAge(numbersOnly);
          }}
          value={age}
        />

        </View>

        <Text style={[styles.appFont, { paddingTop: 10 }]}>
          How many days CAN you workout per week?
        </Text>
        <View style={styles.answerButtons}>
          <TouchableOpacity
            style={selectedDays === "2" ? styles.pressed : styles.unPressed}
            onPress={() => setSelectedDays("2")}
          >
            <Text style={styles.font}> 2 or less</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={selectedDays === "3-4" ? styles.pressed : styles.unPressed}
            onPress={() => setSelectedDays("3-4")}
          >
            <Text style={styles.font}> 3 - 4</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={selectedDays === "4" ? styles.pressed : styles.unPressed}
            onPress={() => setSelectedDays("4")}
          >
            <Text style={styles.font}> 4+</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.appFont]}>
          How long are your usual workout session? (minutes){" "}
        </Text>
        <View style={styles.answerButtons}>
          <TouchableOpacity
            style={selectedSession === "30" ? styles.pressed : styles.unPressed}
            onPress={() => setSelectedSession("30")}
          >
            <Text style={styles.font}> 30 or less </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              selectedSession === "30-60" ? styles.pressed : styles.unPressed
            }
            onPress={() => setSelectedSession("30-60")}
          >
            <Text style={styles.font}> 30 - 60</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              selectedSession === "60+" ? styles.pressed : styles.unPressed
            }
            onPress={() => setSelectedSession("60+")}
          >
            <Text style={styles.font}> 60+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.pressed, { width: 130 }]}
          onPress={handleContinue}
        >
          <View style={styles.continue}>
            <Text
              style={[
                styles.font,
                { color: Colors.white },
                { fontSize: 15 },
                { marginTop: 2 },
              ]}
            >
              Continue
            </Text>
            <AntDesign name="arrow-right" size={15} color={Colors.white} />
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

  font: {
    fontFamily: "Poppins_700Bold",
    fontSize: 12,
  },

  questionaire: {
    flex: 1,
    width: "100%",
    paddingTop: 20,
    paddingHorizontal: 20,
    gap: 15,
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
    width: "40%",
    justifyContent: "space-between",
    paddingRight: 30,
    gap: 15,
  },
  heightAndWeightRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 20,
  },
  inputBox: {
    fontFamily: "Poppins_700Bold",
    borderBottomColor: Colors.gray,
    borderBottomWidth: 1,
  },
  unPressed: {
    borderWidth: 4,
    borderRadius: 30,
    borderColor: Colors.gray,
    backgroundColor: Colors.gray,
    padding: 10,
    width: 120,
    alignItems: "center",
  },
  pressed: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    borderWidth: 4,
    borderRadius: 30,
    padding: 10,
    width: 120,
    alignItems: "center",
  },
  bottomBar: {
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  continue: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  ageBox:{
    width: '40%',
  },
});
