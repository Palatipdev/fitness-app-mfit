import { Colors } from "@/constants/color";
import { auth, db } from "@/firebase/config";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter, useLocalSearchParams } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function editProfile() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const currentName = params.currentName as string;

  const [username, setUsername] = useState(currentName || "");

  const handleSave = async () => {
    if (!username.trim()) {
      Alert.alert("Error", "Username cannot be empty");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) return;

      // Update Firebase
      await updateDoc(doc(db, "users", user.uid), {
        username: username.trim(),
      });

      // Navigate back with updated name
      router.push({
        pathname: "/profilePage",
        params: { updatedName: username.trim() },
      });
    } catch (error) {
      Alert.alert("Error", "Failed to update username");
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.titleLogoFont}>mfit.</Text>
      </View>

      <View style={styles.middleBar}>
        <FontAwesome name="user-circle" size={110} color="grey" />

        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter username"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "flex-start",
  },
  middleBar: {
    marginTop: 20,
    marginHorizontal: 20,
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: 40,
    borderRadius: 30,
    gap: 20,
  },
  titleLogoFont: {
    fontSize: 30,
    color: Colors.primary,
    fontFamily: "Poppins_700Bold",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    fontFamily: "Poppins_500Medium",
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
  },
  cancelText: {
    color: Colors.primary,
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
  },
});
