import { fetchExercise } from "./generator";

import {
  checkRepeatedExercise,
  checkTypeDupe1,
  checkTypeDupe2,
  checkTypeDupe3,
} from "@/utils/workoutHelper";


// TODO: Write function to generate 30-min workout
export async function generate30() {
  const exercises = await fetchExercise();
  let usedType = [];
  let usedExercise = [];
  let parts = ["Chest", "Back", "Shoulder", "Legs"];
  let CI = ["Compound", "Compound", "Compound", "Compound"];
  const sets = [2, 2, 2, 2];
  let exerciseA = [];
  const maxAttempt = 20;
  let attempt = 0;

  for (let i = 0; i < 4; i++) {
    attempt = 0;
    // filter the list
    let list = exercises.filter(
      (exercise) =>
        exercise.primaryMuscle === parts[i] &&
        exercise.compoundIsolation === CI[i] &&
        exercise.type != "Bodyweight" &&
        exercise.type != "Band"
    );
    let index = Math.floor(Math.random() * list.length);
    exerciseA[i] = {
      ...list[index],
      sets: sets[i],
    };

    while (
      checkTypeDupe1(exerciseA[i].type, usedType) === true &&
      attempt < maxAttempt
    ) {
      let index = Math.floor(Math.random() * list.length);
      exerciseA[i] = {
        ...list[index],
        sets: sets[i],
      } as any;
      attempt++;
    }
    usedType.push(exerciseA[i].type);
    usedExercise.push(exerciseA[i].name);
    console.log("Successfully generated", exerciseA[i]);
  }

  parts = ["Legs", "Back", "Chest", "Shoulder"];
  usedType = [];
  let exerciseB = [];

  for (let i = 0; i < 4; i++) {
    attempt = 0;
    // filter the list
    let list = exercises.filter(
      (exercise) =>
        exercise.primaryMuscle === parts[i] &&
        exercise.compoundIsolation === CI[i] &&
        exercise.type != "Bodyweight" &&
        exercise.type != "Band"
    );
    let index = Math.floor(Math.random() * list.length);
    exerciseB[i] = list[index];
    exerciseB[i].sets = sets[i];

    while (
      (checkTypeDupe1(exerciseB[i].type, usedType) === true ||
        checkRepeatedExercise(exerciseB[i].name, usedExercise) === true) &&
      attempt < maxAttempt
    ) {
      let index = Math.floor(Math.random() * list.length);
      exerciseB[i] = {
        ...list[index],
        sets: sets[i],
      } as any;
      attempt++;
    }
    usedType.push(exerciseB[i].type);
    usedExercise.push(exerciseB[i].name);
    console.log("Successfully generated", exerciseB[i]);
  }

  return {
    exerciseA,
    exerciseB,
  };
}

export async function generate45(weekType: "A" | "B") {
  const exercises = await fetchExercise();
  let usedType = [];
  let usedExercise = [];
  let parts = ["Chest", "Chest", "Back", "Back", "Shoulder", "Legs"];
  let CI = [
    "Compound",
    "Isolation",
    "Compound",
    "Isolation",
    "Compound",
    "Compound",
  ];
  let sets = [3, 2, 3, 2, 3, 3];
  let exerciseA = [];
  const maxAttempt = 20;
  let attempt = 0;

  for (let i = 0; i < 6; i++) {
    attempt = 0;
    // filter the list
    let list = exercises.filter(
      (exercise) =>
        exercise.primaryMuscle === parts[i] &&
        exercise.compoundIsolation === CI[i] &&
        exercise.type != "Bodyweight" &&
        exercise.type != "Band"
    );
    let index = Math.floor(Math.random() * list.length);
    exerciseA[i] = {
      ...list[index],
      sets: sets[i],
    };

    while (
      checkTypeDupe2(exerciseA[i].type, usedType) === true &&
      attempt < maxAttempt
    ) {
      let index = Math.floor(Math.random() * list.length);
      exerciseA[i] = {
        ...list[index],
        sets: sets[i],
      } as any;
      attempt++;
    }
    usedType.push(exerciseA[i].type);
    usedExercise.push(exerciseA[i].name);
    console.log("Successfully generated", exerciseA[i].name);
  }

  let legIsolation = weekType === "A" ? "Quads" : "Hamstrings";
  parts = [
    "Legs",
    legIsolation,
    "Back",
    "Chest",
    "Shoulder",
    "Shoulder-Lateral",
    "Shoulder-Rear",
  ];
  CI = [
    "Compound",
    "Isolation",
    "Compound",
    "Compound",
    "Compound",
    "Isolation",
    "Isolation",
  ];
  sets = [3, 2, 3, 3, 3, 2, 1];
  usedType = [];
  let exerciseB = [];

  for (let i = 0; i < 7; i++) {
    attempt = 0;
    // filter the list
    let list = exercises.filter(
      (exercise) =>
        exercise.primaryMuscle === parts[i] &&
        exercise.compoundIsolation === CI[i] &&
        exercise.type != "Bodyweight" &&
        exercise.type != "Band"
    );
    let index = Math.floor(Math.random() * list.length);
    exerciseB[i] = {
      ...list[index],
      sets: sets[i],
    };

    while (
      (checkTypeDupe2(exerciseB[i].type, usedType) === true ||
        checkRepeatedExercise(exerciseB[i].name, usedExercise) === true) &&
      attempt < maxAttempt
    ) {
      let index = Math.floor(Math.random() * list.length);
      exerciseB[i] = {
        ...list[index],
        sets: sets[i],
      } as any;
      attempt++;
    }
    usedType.push(exerciseB[i].type);
    usedExercise.push(exerciseB[i].name);
    console.log("Successfully generated", exerciseB[i].name);
  }

  return {
    exerciseA,
    exerciseB,
  };
}

export async function generate60(weekType: "A" | "B") {
  const exercises = await fetchExercise();
  let legIsolationA = weekType === "A" ? "Quads" : "Hamstrings";
  let legIsolationB = legIsolationA === "Quads" ? "Hamstrings" : "Quads";
  let usedType = [];
  let usedExercise = [];
  let parts = [
    "Chest",
    "Chest",
    "Back",
    "Back",
    "Shoulder",
    "Shoulder-Lateral",
    "Shoulder-Rear",
    "Legs",
    legIsolationA,
  ];
  let CI = [
    "Compound",
    "Isolation",
    "Compound",
    "Isolation",
    "Compound",
    "Isolation",
    "Isolation",
    "Compound",
    "Isolation",
  ];
  let sets = [3, 2, 3, 2, 3, 2, 1, 3, 2];
  let exerciseA = [];
  const maxAttempt = 20;
  let attempt = 0;

  for (let i = 0; i < 9; i++) {
    attempt = 0;
    // filter the list
    let list = exercises.filter(
      (exercise) =>
        exercise.primaryMuscle === parts[i] &&
        exercise.compoundIsolation === CI[i] &&
        exercise.type != "Bodyweight" &&
        exercise.type != "Band"
    );
    let index = Math.floor(Math.random() * list.length);
    exerciseA[i] = {
      ...list[index],
      sets: sets[i],
    };

    while (
      checkTypeDupe3(exerciseA[i].type, usedType) === true &&
      attempt < maxAttempt
    ) {
      let index = Math.floor(Math.random() * list.length);
      exerciseA[i] = {
        ...list[index],
        sets: sets[i],
      } as any;
      attempt++;
    }
    usedType.push(exerciseA[i].type);
    usedExercise.push(exerciseA[i].name);
    console.log("Successfully generated", exerciseA[i].name);
  }
    parts = [
      "Legs",
      legIsolationB,
      "Back",
      "Back",
      "Chest",
      "Chest",
      "Shoulder",
      "Shoulder-Lateral",
      "Biceps",
      "Triceps",
    ];
    CI = [
      "Compound",
      "Isolation",
      "Compound",
      "Isolation",
      "Compound",
      "Isolation",
      "Compound",
      "Isolation",
      "Isolation",
      "Isolation",
    ];
    sets = [3, 2, 3, 2, 3, 2, 3, 2, 2, 2];
    usedType = [];
    let exerciseB = [];

    for (let i = 0; i < 10; i++) {
      attempt = 0;
      // filter the list
      let list = exercises.filter(
        (exercise) =>
          exercise.primaryMuscle === parts[i] &&
          exercise.compoundIsolation === CI[i] &&
          exercise.type != "Bodyweight" &&
          exercise.type != "Band"
      );
      let index = Math.floor(Math.random() * list.length);
      exerciseB[i] = {
        ...list[index],
        sets: sets[i]
      }

      while (
        (checkTypeDupe3(exerciseB[i].type, usedType) === true ||
          checkRepeatedExercise(exerciseB[i].name, usedExercise) === true) &&
        attempt < maxAttempt
      ) {
        let index = Math.floor(Math.random() * list.length);
        exerciseB[i] = {
          ...list[index],
          sets: sets[i],
        } as any;
        attempt++;
      }
      usedType.push(exerciseB[i].type);
      usedExercise.push(exerciseB[i].name);
      console.log("Successfully generated", exerciseB[i]);
    }
    return {
      exerciseA,
      exerciseB,
    };
  
}
