import {
  checkRepeatedExercise,
  checkTypeDupe1,
  checkTypeDupe2,
  checkTypeDupe3,
} from "@/utils/workoutHelper";
import {
  FULL_BODY_TEMPLATES,
  PPL_TEMPLATES,
  UPPER_LOWER_TEMPLATES,
} from "@/utils/workoutTemplate";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase/config";

export async function fetchExercise() {
  console.log("Starting fetching process");

  const exerciseRef = collection(db, "exercises");
  const allExercises = await getDocs(exerciseRef);
  // gives a snapshot like a box
  // an object that CONTAINS the exercises

  //Since its an object this is the syntax
  //take each exercises document, map the data into the array exercises
  const exercises = allExercises.docs.map((exercise) => exercise.data());
  //return the exercises array
  return exercises;
}

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

export async function generatorDay(
  weekType: "A" | "B",
  dayTemplate: any[],
  dupeCheckTypeFunc: Function,
  dupeCheckExercise: Function,
  exercises: any[]
) {
  let usedType: string[] = [];
  let usedExercise: string[] = [];
  let workout: any[] = [];
  const maxAttempt = 20;

  console.log("Generating Day", dayTemplate);
  // TODO: Loop through each exercise spec in dayTemplate
  for (let spec = 0; spec < dayTemplate.length; spec++) {
    let attempt = 0;
    // TODO: Inside loop, handle week-dependent muscles
    let targetMuscle = dayTemplate[spec].muscle;
    if (dayTemplate[spec].weekDependent) {
      if (dayTemplate[spec].muscle === "legIsolation") {
        targetMuscle = weekType === "A" ? "Quads" : "Hamstrings";
      } else if (dayTemplate[spec].muscle === "thighIsolation") {
        targetMuscle = weekType === "A" ? "Inner Thigh" : "Outer Thigh";
      } else if (dayTemplate[spec].muscle === "legIsolationA") {
        targetMuscle = weekType === "A" ? "Quads" : "Hamstrings";
      } else if (dayTemplate[spec].muscle === "legIsolationB") {
        targetMuscle = weekType === "A" ? "Hamstrings" : "Quads";
      }
    }

    let list = exercises.filter(
      (exercises) =>
        exercises.primaryMuscle === targetMuscle &&
        exercises.compoundIsolation === dayTemplate[spec].ci &&
        exercises.type != "Bodyweight" &&
        exercises.type != "Band"
    );
    let index = Math.floor(Math.random() * list.length);
    workout[spec] = {
      ...list[index],
      sets: dayTemplate[spec].sets,
    };
    while (
      dupeCheckTypeFunc(workout[spec], usedType) == true &&
      dupeCheckExercise(workout[spec], usedExercise) == true &&
      attempt < maxAttempt
    ) {
      let index = Math.floor(Math.random() * list.length);
      workout[spec] = {
        ...list[index],
        sets: dayTemplate[spec].sets,
      };
    }
    usedType.push(workout[spec].type);
    usedExercise.push(workout[spec].name);
  }

  return workout;
}

export async function generateWorkout(weekType: "A" | "B") {
  const { workoutDays, sessionLength } = await getOnboardingData();
  const exercises = await fetchExercise();
  let dupeFunc;
  if (sessionLength == "30") {
    dupeFunc = checkTypeDupe1;
  } else if (sessionLength == "30-60") {
    dupeFunc = checkTypeDupe2;
  } else {
    dupeFunc = checkTypeDupe3;
  }

  //FB
  if (workoutDays === "2") {
    //Template to be built
    let currentTemplate = FULL_BODY_TEMPLATES[sessionLength];

    let dayA = await generatorDay(
      weekType,
      currentTemplate.dayA,
      dupeFunc,
      checkRepeatedExercise,
      exercises
    );
    let dayB = await generatorDay(
      weekType,
      currentTemplate.dayB,
      dupeFunc,
      checkRepeatedExercise,
      exercises
    );
    return {
      dayA,
      dayB,
    };
  }
  //UL
  else if (workoutDays === "3-4") {
    let currentTemplate = UPPER_LOWER_TEMPLATES[sessionLength];

    let upperA = await generatorDay(
      weekType,
      currentTemplate.upperA,
      dupeFunc,
      checkRepeatedExercise,
      exercises
    );
    let upperB = await generatorDay(
      weekType,
      currentTemplate.upperB,
      dupeFunc,
      checkRepeatedExercise,
      exercises
    );
    let lowerA = await generatorDay(
      weekType,
      currentTemplate.lowerA,
      dupeFunc,
      checkRepeatedExercise,
      exercises
    );
    let lowerB = await generatorDay(
      weekType,
      currentTemplate.lowerB,
      dupeFunc,
      checkRepeatedExercise,
      exercises
    );
    return {
      upperA,
      upperB,
      lowerA,
      lowerB,
    };
  }
  // PPL
  else {
    //Template to be built
    let currentTemplate = PPL_TEMPLATES[sessionLength];

    let pushA = await generatorDay(
      weekType,
      currentTemplate.pushA,
      dupeFunc,
      checkRepeatedExercise,
      exercises
    );
    let pullA = await generatorDay(
      weekType,
      currentTemplate.pullA,
      dupeFunc,
      checkRepeatedExercise,
      exercises
    );
    let legsA = await generatorDay(
      weekType,
      currentTemplate.legsA,
      dupeFunc,
      checkRepeatedExercise,
      exercises
    );
    let pushB = await generatorDay(
      weekType,
      currentTemplate.pushB,
      dupeFunc,
      checkRepeatedExercise,
      exercises
    );
    let pullB = await generatorDay(
      weekType,
      currentTemplate.pullB,
      dupeFunc,
      checkRepeatedExercise,
      exercises
    );
    let legsB = await generatorDay(
      weekType,
      currentTemplate.legsB,
      dupeFunc,
      checkRepeatedExercise,
      exercises
    );

    return {
      pushA,
      pullA,
      legsA,
      pushB,
      pullB,
      legsB,
    };
  }
}

export async function generateWorkoutTesting(
  weekType: "A" | "B",
  sessionLength: "30" | "30-60" | "60+",
  workoutDays: "2" | "3-4" | "4+"
) {
  const exercises = await fetchExercise();
  let dupeFunc;
  if (sessionLength == "30") {
    dupeFunc = checkTypeDupe1;
  } else if (sessionLength == "30-60") {
    dupeFunc = checkTypeDupe2;
  } else {
    dupeFunc = checkTypeDupe3;
  }

  //FB
  if (workoutDays === "2") {
    //Template to be built
    let currentTemplate = FULL_BODY_TEMPLATES[sessionLength];

    let dayA = await generatorDay(
      weekType,
      currentTemplate.dayA,
      dupeFunc,
      checkRepeatedExercise,
      exercises
    );
    let dayB = await generatorDay(
      weekType,
      currentTemplate.dayB,
      dupeFunc,
      checkRepeatedExercise,
      exercises
    );
    return {
      dayA,
      dayB,
    };
  }
  //UL
  else if (workoutDays === "3-4") {
    let currentTemplate = UPPER_LOWER_TEMPLATES[sessionLength];

    let upperA = await generatorDay(
      weekType,
      currentTemplate.upperA,
      dupeFunc,
      checkRepeatedExercise,
      exercises
    );
    let upperB = await generatorDay(
      weekType,
      currentTemplate.upperB,
      dupeFunc,
      checkRepeatedExercise,
      exercises
    );
    let lowerA = await generatorDay(
      weekType,
      currentTemplate.lowerA,
      dupeFunc,
      checkRepeatedExercise,
      exercises
    );
    let lowerB = await generatorDay(
      weekType,
      currentTemplate.lowerB,
      dupeFunc,
      checkRepeatedExercise,
      exercises
    );
    return {
      upperA,
      upperB,
      lowerA,
      lowerB,
    };
  }
  // PPL
  else {
    //Template to be built
    let currentTemplate = PPL_TEMPLATES[sessionLength];

    let pushA = await generatorDay(
      weekType,
      currentTemplate.pushA,
      dupeFunc,
      checkRepeatedExercise,
      exercises
    );
    let pullA = await generatorDay(
      weekType,
      currentTemplate.pullA,
      dupeFunc,
      checkRepeatedExercise,
      exercises
    );
    let legsA = await generatorDay(
      weekType,
      currentTemplate.legsA,
      dupeFunc,
      checkRepeatedExercise,
      exercises
    );
    let pushB = await generatorDay(
      weekType,
      currentTemplate.pushB,
      dupeFunc,
      checkRepeatedExercise,
      exercises
    );
    let pullB = await generatorDay(
      weekType,
      currentTemplate.pullB,
      dupeFunc,
      checkRepeatedExercise,
      exercises
    );
    let legsB = await generatorDay(
      weekType,
      currentTemplate.legsB,
      dupeFunc,
      checkRepeatedExercise,
      exercises
    );

    return {
      pushA,
      pullA,
      legsA,
      pushB,
      pullB,
      legsB,
    };
  }
}
