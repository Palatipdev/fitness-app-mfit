import { auth, db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";

export async function getOnboardingData() {
  console.log("Fetching data");

  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("not logged in");

  const userDoc = await getDoc(doc(db, "users", currentUser.uid));
  if (!userDoc.exists()) {
    throw new Error("User document not found");
  }
  const userData = userDoc.data();

  console.log("Retreived onboarding");
  return {
    workoutDays: userData.onboarding.workoutDays as "2" | "3-4" | "4+",
    sessionLength: userData.onboarding.sessionLength as "30" | "30-60" | "60+",
  };
}

export async function getOnboardingDate(){
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error ("not logged in");

    const userDoc = await getDoc(doc(db,"users",currentUser.uid));
    if (!userDoc.exists()) {
        throw new Error ("User document not found");
    }

    const userData = userDoc.data();

    return  userData.onboarding.completedAt 
    
}

export async function getWeek(){
    const createdDay = await getOnboardingDate()
    const createdDayJS = new Date(createdDay);
    let currentDiff = new Date().getTime() - createdDayJS.getTime()
    if (Math.trunc(currentDiff / 604800000) % 2 == 1){
        return 'B'
    }
    else{
        return 'A'
    }
}