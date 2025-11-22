import { Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useRouter } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/color";

export default function HomeScreen() {
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
        <Text style={styles.titleLogoFont} allowFontScaling={true}>
          mfit.
        </Text>
      </View>

      <View style={styles.middleBar}>
        <View style={styles.MiddleCatchPhrase}>
          <Text style={styles.catchPhraseFont}>
            BECAUSE FITNESS STARTS WITH YOU.
          </Text>
        </View>
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.GS_Button} onPress={() => router.push('/onboarding')}>
          <Text style={styles.GSAppFont}>Get Started</Text>
        </TouchableOpacity>

        <Text style={styles.or }>or</Text>

        <TouchableOpacity style={styles.GS_Button} onPress={() => router.push('/sign-in')}>
          <Text style={styles.GSAppFont}>Sign In</Text>
        </TouchableOpacity>
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
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: "flex-start",
  },
  middleBar: {
    flex: 1,
  },
  bottomBar: {
    flex: 1,
    alignItems: "center",
    paddingTop: 25,
  },
  titleLogoFont: {
    fontSize: 30,
    color: Colors.primary,
    fontFamily: "Poppins_700Bold",
  },
  GSAppFont: {
    fontWeight: "bold",
    fontSize: 15,
    color: Colors.white,
    fontFamily: "Poppins_700Bold",
  },

  MiddleCatchPhrase: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  catchPhraseFont: {
    fontWeight: "bold",
    fontSize: 24,
    color: Colors.primary,
    fontFamily: "Poppins_700Bold",
  },
  GS_Button: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    borderWidth: 4,
    padding: 20,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  or: {
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 16,
  },
});
