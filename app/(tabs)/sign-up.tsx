import FloatingLabelInput from "@/components/floating-label-input";
import { auth, db } from "@/firebase/config";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Colors } from "../../constants/color";

import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUp() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [passWord, setPassWord] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onboardingData = useLocalSearchParams();

  // handleSignUp function
  const handleSignUp = async () => {
    if (!email) {
      Alert.alert("Please enter your email");
      return;
    }
    if (!passWord) {
      Alert.alert("Please enter your password");
      return;
    }
    if (!userName) {
      Alert.alert("Please enter your userName");
      return;
    }
    if (!email || !passWord || !userName) {
      Alert.alert("Please enter all the field.");
      return;
    }
    if (passWord !== confirmPassword) {
      Alert.alert("Password do not match");
      return;
    }
    if (passWord.length < 6) {
      Alert.alert("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      //Create auth account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        passWord
      );
      const userId = userCredential.user.uid;

      // store username in firestore , add onboarding data
      await setDoc(doc(db, "users", userId), {
        username: userName,
        email: email,
        createdAt: new Date().toISOString(),
        onboarding: {
          goal: onboardingData.goal,
          height: parseInt(onboardingData.height as string),
          weight: parseInt(onboardingData.weight as string),
          gender: onboardingData.gender,
          age: parseInt(onboardingData.age as string),
          workoutDays: onboardingData.workoutDays,
          sessionLength: onboardingData.sessionLength,
          completedAt: new Date().toISOString()
        },
      });

      console.log("User created with username:", userName);

      // Success sign up.
      router.replace('/homepage')
    } catch (error: any) {
      console.error("Sign up error:", error);

      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Error", "This email is already registered");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Error", "Invalid email address");
      } else {
        Alert.alert("Error", "Sign up failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <AntDesign name="arrow-left" size={24} color={Colors.primary} />
          <Text style={styles.appFont}>Back</Text>
        </Pressable>
        <Text style={styles.header}>Create an Account!</Text>
      </View>

      <View style={styles.middleBar}>
        <FloatingLabelInput
          label="Username"
          onChangeText={setUserName}
          value={userName}
          keyboardType="default"
          autoCapitalize="none"
        />

        <FloatingLabelInput
          label="Email"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <FloatingLabelInput
          label="Password"
          onChangeText={setPassWord}
          value={passWord}
          secureTextEntry={true}
        />
        <FloatingLabelInput
          label="Confirm your password"
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          secureTextEntry={true}
        />

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text
            style={[styles.appFont, { fontSize: 16 }, { color: Colors.white }]}
          >
            {loading ? "Creating Account..." : "Sign up"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomBar}>
        <Text>Or Sign Up with</Text>
        <View style={styles.otherSignInOptions}>
          <TouchableOpacity>
            <Text>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>Apple</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.backToSignIn}>
          <Text>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/sign-in")}>
            <Text style={{ color: Colors.primary }}>Sign In</Text>
          </TouchableOpacity>
        </View>
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
    paddingBottom: 10,
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
  header: {
    fontSize: 24,
    color: Colors.primary,
    fontFamily: "Poppins_700Bold",
    paddingHorizontal: 30,
    paddingTop: 30,
  },

  middleBar: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    gap: 20,
  },
  inputBox: {
    backgroundColor: Colors.gray,
    borderColor: Colors.gray,
    borderWidth: 10,
    padding: 20,
    paddingHorizontal: 10,
    borderRadius: 30,
    fontFamily: "Poppins_700Bold",
    textAlign: "left",
    width: 300,
  },

  continueButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    borderWidth: 10,
    padding: 7,
    paddingHorizontal: 80,
    borderRadius: 30,
    marginTop: 20,
  },
  bottomBar: {
    flex: 1,
    alignItems: "center",
    marginTop: 300,
  },

  otherSignInOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    marginTop: 10,
  },
  backToSignIn: {
    flexDirection: "row",
    marginTop: 20,
    gap: 5,
  },
});
