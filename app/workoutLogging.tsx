import { Colors } from "@/constants/color";
import { Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function workoutLogging() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const workout = params.workout ? JSON.parse(params.workout as string) : null;
  const splitName = params.splitName;
  const [fontLoaded] = useFonts({
    Poppins_700Bold,
  });

  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setIsRunning(true);
  }, []);
  useEffect(() => {
    let interval: any;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const timeString = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")} `;
  if (!fontLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.titleLogoFont} allowFontScaling={true}>
              mfit.
            </Text>
          </View>
          <View>
            <Text style={{ fontFamily: "Popins_700Bold", fontSize: 18 }}>
              Workout:
            </Text>
            <Text style={{ fontFamily: "Popins_700Bold", fontSize: 18 }}>
              {timeString}
            </Text>
          </View>
          <View>
            <TouchableOpacity onPress={() => router.push("/homepage")}>
              <Text
                style={{
                  fontFamily: "Poppins_700Bold",
                  color: Colors.primary,
                  fontSize: 18,
                }}
              >
                Finish
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.workouts}>
          <Text></Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleLogoFont: {
    fontSize: 30,
    color: Colors.primary,
    fontFamily: "Poppins_700Bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
