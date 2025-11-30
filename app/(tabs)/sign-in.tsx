import FloatingLabelInput from "@/components/floating-label-input";
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
  TouchableOpacity,
  View
} from "react-native";

//auth
import { auth } from '@/firebase/config';
import { signInWithEmailAndPassword } from "firebase/auth";

import { Colors } from "../../constants/color";

export default function SignIn() {
  const router = useRouter();
  const [fontLoaded] = useFonts({
    Poppins_700Bold,
  });

  const [passWord, setPassWord] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");



  const handleSignIn = async() => {
    if (!email) {
      Alert.alert("Please enter your email");
      return;
    }
    if (!passWord) {
      Alert.alert("Please enter your password");
      return;
    }
        if (!email || !passWord ) {
          Alert.alert("Please enter all the field.");
          return;
        
    }
  
  setLoading(true);
  try{  
    const userCredential = await signInWithEmailAndPassword(auth, email,passWord);
    console.log ("Successfully signed in!" , userCredential.user.uid)
    Alert.alert("Success!", "Signed in successfully");

    // Navigate to home page when created
    router.push('/(tabs)/homepage')
  }

catch (error: any) {
      console.error("Sign in error:", error);
      
      if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
        Alert.alert("Error", "Invalid email or password");
      } else if (error.code === "auth/user-not-found") {
        Alert.alert("Error", "No account found with this email");
      } else {
        Alert.alert("Error", "Sign in failed: " + error.message);
      }
    } finally {
      setLoading(false);
    }
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
        <Text style={styles.header}>Sign in</Text>
      </View>

      <View style={styles.middleBar}>
        <FloatingLabelInput
          label='Email'
          value={email}
          onChangeText={setEmail}
          keyboardType="default"
        />

        <FloatingLabelInput
          label="Password"
          autoCapitalize='none'
          onChangeText={setPassWord}
          value={passWord}
          secureTextEntry={true}
        />
        <TouchableOpacity style={styles.continueButton}
        onPress = {handleSignIn}
        disabled = {loading}>
          <Text
            style={[styles.appFont, { fontSize: 20 }, { color: Colors.white }]}
          >
            {loading ? 'Signing in...' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomBar}>
        <Text>Or Sign In with</Text>
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
        <View style={styles.getStarted}>
          <Text>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/onboarding')}>
            <Text style={{ color: Colors.primary }} >Get Started!</Text>
          </TouchableOpacity>
        </View>
      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topBar: {
    flex: 1,
    width: "100%",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 5,
  },
  header: {
    fontSize: 30,
    color: Colors.primary,
    fontFamily: "Poppins_700Bold",
    paddingHorizontal: 30,
    paddingTop: 30,
  },
  appFont: {
    color: Colors.primary,
    fontFamily: "Poppins_700Bold",
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
    borderWidth: 3,
    padding: 15,
    paddingHorizontal: 10,
    borderRadius: 30,
    fontFamily: "Poppins_700Bold",
    textAlign: 'left',
    width: 250,
  },

  bottomBar: {
    flex: 1,
    alignItems: "center",
    marginTop: 70,
  },

  continueButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    borderWidth: 10,
    padding: 10,
    paddingHorizontal: 100,
    borderRadius: 30,
    marginTop: 5,
  },
  otherSignInOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    marginTop: 20,
  },
  getStarted: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 5,
  },
});
