import { auth, db } from "@/firebase/config";
import { getOnboardingData, getWeek } from "@/utils/fetchData";
import { doc, setDoc } from "firebase/firestore";
import { generateWorkout } from "./generator";

export async function saveWorkout() {
  const { workoutDays, sessionLength } = await getOnboardingData();
  const currentWeek = await getWeek();
  let otherWeek: "A" | "B";
  if (currentWeek == "A") {
    otherWeek = "B";
  } else {
    otherWeek = "A";
  }
  console.log("Generating")
  //generating the workout
  const currentWeekWorkout = await generateWorkout(currentWeek);
  const otherWeekWorkout = await generateWorkout(otherWeek);
  console.log("Generated workout")
  //saving the workout to firestore
  //since there are two workout routine we can use collection
  console.log("Saving to firebase")
  try{
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("not logged in");
  const workoutRef = doc(db,"users",currentUser.uid,"workout","current")
  

  await setDoc(workoutRef,{
    weekA: currentWeekWorkout,
    weekB: otherWeekWorkout
  }
);
 
 console.log("saved to firebase")

  }
  catch (error){
    console.log("Error", error)
  }

}

export async function loadCurrentWorkout() {
  // 1. use some react native code to load the workout into the homepage
}


