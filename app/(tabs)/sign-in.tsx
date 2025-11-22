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

export default function SignIn() {
  const router = useRouter();
  const [fontLoaded] = useFonts({
    Poppins_700Bold,
  });

  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");
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
        <Text style={styles.header}>Sign in</Text>
      </View>

      <View style={styles.middleBar}>
        <TextInput
          style={styles.inputBox}
          placeholder="Username or Email"
          onChangeText={setUserName}
          value = {userName}
        />

        <TextInput
          style={styles.inputBox}
          placeholder="Password"
          onChangeText={setPassWord}
          value = {passWord}
          secureTextEntry={true}
        />
        <TouchableOpacity style={styles.continueButton}>
          <Text
            style={[styles.appFont, { fontSize: 20 }, { color: Colors.white }]}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomBar}>
        <Text>Or sign in with</Text>
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
      </View>
    </SafeAreaView>
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
    paddingHorizontal: 55,
    borderRadius: 30,
    fontFamily: "Poppins_700Bold",
  },

  bottomBar: {
    flex: 1,
    alignItems: "center",
  },

  continueButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    borderWidth: 10,
    padding: 10,
    paddingHorizontal: 100,
    borderRadius: 30,
  },
  otherSignInOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    paddingTop: 15,
  },
});
