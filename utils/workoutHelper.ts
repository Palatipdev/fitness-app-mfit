

export function checkTypeDupe1(equipmentType: string, usedTypeArray: string[]) {
  let count = 0;
  for (let i = 0; i < usedTypeArray.length; i++) {
    if (equipmentType === usedTypeArray[i]) {
      count++;
    }
  }
  return count >= 1;
}

export function checkTypeDupe2(equipmentType: string, usedTypeArray: string[]) {
  let count = 0;
  for (let i = 0; i < usedTypeArray.length; i++) {
    if (equipmentType === usedTypeArray[i]) {
      count++;
    }
  }
  return count >= 2;
}

export function checkTypeDupe3(equipmentType: string, usedTypeArray: string[]) {
  let count = 0;
  for (let i = 0; i < usedTypeArray.length; i++) {
    if (equipmentType === usedTypeArray[i]) {
      count++;
    }
  }
  return count >= 3;
}


export function checkRepeatedExercise(exerciseName: string, usedExerciseList: string[]) {
  for (let i = 0; i < usedExerciseList.length; i++) {
    if (exerciseName === usedExerciseList[i]) {
      return true;
    }
  }
  return false;
}