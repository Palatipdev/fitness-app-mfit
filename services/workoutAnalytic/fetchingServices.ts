import { auth, db } from "@/firebase/config";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

export async function fetchPastWorkouts() {
  console.log("fetching past workouts");

  //get user id
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("user not authenticated");
  }
  const workoutRef = collection(db, "users", currentUser.uid, "logs");
  const allWorkout = await getDocs(workoutRef);
  // get the snapshot
  // an object that contains the past workout

  const workouts = allWorkout.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  console.log("fetched workouts: ", workouts);
  return workouts;
}

export async function fetchInitial() {
  console.log("fetching initials");

  // getting user id

  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("user not authenticated");
  }
  const workoutRef = getDoc(doc(db, "users", currentUser.uid));
  const userName = (await workoutRef).data();

  if (userName) {
    return userName.username[0].toUpperCase();
  }
  return "";
}
