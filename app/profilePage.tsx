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
import { useRouter } from "expo-router";
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

export default function profilePage() {
  const router = useRouter();
  const [initial, setInitial] = useState("");
  const [loggedCount, setLoggedCount] = useState(0);
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.updatedName) {
      setInitial(params.updatedName as string);
    } else {
      const getInitialFunction = async () => {
        const username = await fetchInitial();
        if (!username) {
        } else {
          setInitial(username);
        }
      };
      getInitialFunction();
    }

    const getLoggedCount = async () => {
      const count = await fetchLogCount();
      if (count) {
        setLoggedCount(count);
      }
    };

    getLoggedCount();
  }, [params.updatedName]);

  return (
    <SafeAreaView style={styles.container}>
      {/* LOGO AND TOPBAR */}
      <View style={styles.topBar}>
        {/* Logo */}
        <View>
          <Text style={styles.titleLogoFont} allowFontScaling={true}>
            mfit.
          </Text>
        </View>
      </View>

      {/* PROFILE PICTURE AND NAME */}
      <View style={styles.middleBar}>
        <FontAwesome name="user-circle" size={110} color="grey" />
        <Text
          style={{
            fontFamily: "Poppins_500Medium",
            color: Colors.primary,
            fontSize: 21,
          }}
        >
          {initial}
        </Text>
      </View>

      <View style={styles.bottomBar}>
        <View style={styles.workoutLoggedCount}>
          <Text
            style={{
              color: Colors.white,
              fontSize: 21,
              fontFamily: "Poppins_500Medium",
            }}
          >{`Workout Logged: ${loggedCount}`}</Text>
        </View>

        <View style={styles.moreOptionsBox}>
          <TouchableOpacity
            style={styles.optionBox}
            onPress={() =>
              router.push({
                pathname: "/editProfile",
                params: {
                  name: initial,
                },
              })
            }
          >
            <View style={styles.optionBoxLeft}>
              <Feather name="user" size={28} color="black" />
              <Text style={{ fontSize: 18, fontFamily: "Poppins_500Medium" }}>
                Edit Profile
              </Text>
            </View>
            <Entypo name="chevron-thin-right" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionBox}
            onPress={() => router.push("/aboutPage")}
          >
            <View style={styles.optionBoxLeft}>
              <FontAwesome5 name="question-circle" size={24} color="black" />
              <Text style={{ fontSize: 18, fontFamily: "Poppins_500Medium" }}>
                About
              </Text>
            </View>
            <Entypo name="chevron-thin-right" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.logOut}
          onPress={() => {
            signOut(auth);
            router.replace("/sign-in");
          }}
        >
          <View style={styles.optionBoxLeft}>
            <MaterialIcons name="exit-to-app" size={28} color="black" />
            <Text style={{ fontSize: 18, fontFamily: "Poppins_500Medium" }}>
              {" "}
              Log Out{" "}
            </Text>
          </View>
          <Entypo name="chevron-thin-right" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* NAVIGATION BAR */}
      <View style={styles.navBar}>
        <Pressable onPress={() => router.push("/homepage")}>
          <Feather name="home" size={24} color="black" />
        </Pressable>
        <Pressable onPress={() => router.push("/progressAnalytics")}>
          <Feather name="book" size={24} color="black" />
        </Pressable>
        <Pressable onPress={() => router.push("/profilePage")}>
          <FontAwesome name="user-circle" size={24} color="grey" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
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
  middleBar: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderColor: Colors.white,
    backgroundColor: Colors.white,
    padding: 50,
    marginHorizontal: 20,
    borderRadius: 30,
  },
  bottomBar: {
    flex: 1,
    paddingHorizontal: 20,
  },
  workoutLoggedCount: {
    borderColor: Colors.white,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 30,
  },
  moreOptionsBox: {
    paddingHorizontal: 20,
    justifyContent: "center",
    gap: 30,
    marginTop: 30,
    borderColor: Colors.white,
    backgroundColor: Colors.white,
    padding: 40,
    borderRadius: 30,
  },
  optionBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionBoxLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  logOut: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: Colors.white,
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 30,
    marginTop: 20,
  },

  navBar: {
    height: 60,
    bottom: 0,
    left: 0,
    right: 0,
    position: "absolute",
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 50,
    flexDirection: "row",
    gap: 100,
    paddingTop: 5,
  },
});
