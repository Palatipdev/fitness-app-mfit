import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase/config";

async function addGlutes() {
  const gluteExercise = [
    {
      compoundIsolation: "Compound",
      name: "Hip Thrust",
      primaryMuscle: "Glutes",
      secondaryMuscle: "Hamstrings",
      strengthHypertrophy: "Hypertrophy",
      tertiaryMuscle: "",
      type: "Barbell",
    },
    {
      compoundIsolation: "Isolation",
      name: "Cable Glute Kickback",
      primaryMuscle: "Glutes",
      secondaryMuscle: "",
      strengthHypertrophy: "Hypertrophy",
      tertiaryMuscle: "",
      type: "Cable",
    },

    {
      compoundIsolation: "Compound",
      name: "Bulgarian Split Squat",
      primaryMuscle: "Glutes",
      secondaryMuscle: "Quads",
      strengthHypertrophy: "Hypertrophy",
      tertiaryMuscle: "Hamstrings",
      type: "Dumbbell",
    },

    {
      compoundIsolation: "Isolation",
      name: "Machine Glute Kickback",
      primaryMuscle: "Glutes",
      secondaryMuscle: "",
      strengthHypertrophy: "Hypertrophy",
      tertiaryMuscle: "",
      type: "Machine",
    },

    {
      compoundIsolation: "Compound",
      name: "Smith Machine Hip Thrust",
      primaryMuscle: "Glutes",
      secondaryMuscle: "Hamstrings",
      strengthHypertrophy: "Hypertrophy",
      tertiaryMuscle: "",
      type: "Barbell",
    },

    {
      compoundIsolation: "Isolation",
      name: "Dumbbell Hip Thrust",
      primaryMuscle: "Glutes",
      secondaryMuscle: "Hamstrings",
      strengthHypertrophy: "Hypertrophy",
      tertiaryMuscle: "",
      type: "Dumbbell",
    },
  ];

  const  exerciseRef = collection(db,"exercises")

  for (const exercise of gluteExercise){
     await addDoc(exerciseRef,exercise)
     console.log("added: ",exercise.name)
  }
}
addGlutes();
