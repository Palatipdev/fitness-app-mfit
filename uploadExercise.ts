// Importing addDoc and collection function
import { addDoc, collection } from "firebase/firestore";

// Importing current database
import { db } from "./firebase/config";

// Importing exercises library
import exercisesData from "./exercises.json";

// Upload function
async function uploadExercises() {
  console.log("Starting upload of", exercisesData.length, "exercises...");

  try {
    // Create a pointer to a folder called exercises inside firestore
    const exercisesRef = collection(db, "exercises");

    // loop through each exercise in the library
    for (const exercise of exercisesData) {
      // addDoc to log each exercise in the folfer exercisesRef points to
      await addDoc(exercisesRef, exercise);
      console.log(`Uploaded: ${exercise.name}`);
    }

    console.log("Upload complete! All exercises uploaded to Firebase.");
  } catch (error) {
    console.error("Error uploading exercises:", error);
  }
}

// Run the function
uploadExercises();
