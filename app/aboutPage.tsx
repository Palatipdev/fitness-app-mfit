import { Colors } from "@/constants/color";
import { auth } from "@/firebase/config";
import {
  fetchInitial,
  fetchLogCount,
} from "@/services/workoutAnalytic/fetchingServices";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { Linking } from "react-native";

export default function aboutPage() {
  const router = useRouter();
  const ABOUT_SECTION = [
    {
      title: "Version",
      description: "1.0.0 MVP",
    },
    {
      title: "Description",
      description:
        "personalized fitness tracking app that generates custom workout plan based on your goals, experience level, and time constraints. Tracking your progress using complex algorithm.",
      stacked: true,
    },
    {
      title: "Creator",
      description: "Built and designed by Palatip Boonmeerit, CS @ Unimelb",
      stacked: true,
    },
    {
      title: "Github",
      description: "https://github.com/Palatipdev/fitness-app-mfit",
      url: "https://github.com/Palatipdev/fitness-app-mfit",
    },
    {
      title: "Contact",
      description: "palatipten@gmail.com",
    },
  ];
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <AntDesign name="arrow-left" size={24} color={Colors.primary} />
          <Text style={styles.appFont}>Back</Text>
        </Pressable>
      </View>

      <View style={styles.middleBar}>
        {ABOUT_SECTION.map((item) => (
          <View
            key={item.title}
            style={[
              styles.sectionBundle,
              item.stacked && styles.sectionStacked,
            ]}
          >
            <Text style={styles.titleFont}>{`${item.title}:`}</Text>
            <Text
              style={[
                styles.descriptionFont,
                item.stacked && styles.stackedDescription,
                item.url && styles.linkText,
              ]}
              onPress={item.url ? () => Linking.openURL(item.url) : undefined}
            >
              {item.description}
            </Text>
          </View>
        ))}
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
    alignItems: "flex-start",
  },

  titleLogoFont: {
    fontSize: 30,
    color: Colors.primary,
    fontFamily: "Poppins_700Bold",
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
    fontSize: 20,
  },
  middleBar: {
    borderWidth: 1,
    backgroundColor: Colors.white,
    borderColor: Colors.white,
    padding: 125,
    borderRadius: 30,
    paddingHorizontal: 30,
    marginHorizontal: 30,
    marginVertical: 30,
    gap: 20,
  },
  sectionBundle: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  titleFont: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    color: Colors.primary,
    marginRight: 5,
  },

  descriptionFont: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: Colors.black,
  },
  sectionStacked: {
    flexDirection: "column",
  },
  stackedDescription: {
    marginLeft: 10,
  },
  linkText: {
    textDecorationLine: "underline",
  },
});
