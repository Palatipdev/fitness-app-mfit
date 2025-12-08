import { generateWorkoutTesting } from "./generator";

async function testAllworkouts() {
  const fb45 = await generateWorkoutTesting("A", "30-60", "2");
  console.log("Generated Workout: ", fb45);

  const fb60 = await generateWorkoutTesting("A", "60+", "2");
  console.log("Generated Workout: ", fb60);

  const ul30 = await generateWorkoutTesting("A", "30", "3-4");
  console.log("Generated Workout: ", fb60);




  const a = await generateWorkoutTesting("A", "30", "4+");
  console.log("Generated Workout: ", a);


  const c = await generateWorkoutTesting("A", "60+", "4+");
  console.log("Generated Workout: ", c);
}

testAllworkouts();
