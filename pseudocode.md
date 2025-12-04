<!-- 

Less than 30 mins:

Fullbody Day A



parts = [chest,back,shoulder,leg]

	for i in range 0 to 3:
		exercise[i] = generate
	While ( checkTypeDupe(exercise[i].type) == true )
		exercise[i] = ( now give random that is Compoud , Type = Machine/Barbell/Dumbbell, Primary = parts[i])
	usedExercise[i] = exercise[i]
	usedType[i] = exercise.type[i]


usedType[] = “”
parts = [leg,back,chest,shoulder]
	for i in range 0 to 3:
		exercise[i] = generate
	While (checkTypeDupe(exercise[i].type) == true || (checkRepeatedExercise(exercise[i]) == true ) ):
		exercise[i] = ( now give random that is Compoud , Type = Machine/Barbell/Dumbbell, Primary = parts[i])
	

usedType.append(exercise[i].type) 
usedExercise.append(exercise[i])

checkTypeDupe(val : exercise.type) returns boolean:
for i 0 to len(usedType) - 1:
	if val == usedType[i] :
		return 1:
return 0;

checkRepeatedExercise(val : exercise) return boolean:
for i 0 to len(usedExercise) -1 :
	if val == usedExercise[i]:
		return 1:
reutrn 0; 

30-60 mins
1 Chest C
1 Chest I
1 Back C
1 Back I
1 Shou C
1 Leg C

Day A:
    for i = (0,3,2):
        exercise[i] = generate...
        ex
        while
-->
