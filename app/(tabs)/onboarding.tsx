import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import {
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/color";

export default function OnBoarding() {
  const router = useRouter();

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
          <TouchableOpacity style = {styles.unPressed}>
            <Text> Weight Lost</Text>
          </TouchableOpacity>
          <TouchableOpacity style = {styles.unPressed}>
            <Text> Maintain</Text>
          </TouchableOpacity >
          <TouchableOpacity style = {styles.unPressed}>
            <Text> Gain Weight</Text>
          </TouchableOpacity>
          
        </View>
        <Text style={styles.appFont}>What is your height and weight?</Text>
        <View style = {styles.heightAndWeight}> 

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
    alignItems: "flex-start",
    width: "100%",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  answerButtons: {
    backgroundColor: 'red',
    width: '100%',
    height: '10%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heightAndWeight: {},
  unPressed: {
    
  },
  pressed :{
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    borderWidth: 4,
    borderRadius: 30,
  },
});
