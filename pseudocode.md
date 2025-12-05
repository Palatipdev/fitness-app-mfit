<!-- === 30-MIN FULL BODY ===

Day A:
    usedType = []
    usedExercise = []
    parts = ["Chest", "Back", "Shoulder", "Legs"]
    CI = ["C", "C", "C", "C"]
    sets = [2, 2, 2, 2]
    
    for i in range(0, 4):
        exercise[i] = generate(parts[i], CI[i], sets[i], 8)
        
        while (checkTypeDupe1(exercise[i].type) == true):
            exercise[i] = generate(parts[i], CI[i], sets[i], 8)
        
        usedType.append(exercise[i].type)
        usedExercise.append(exercise[i])


Day B:
    usedType = []
    parts = ["Legs", "Back", "Chest", "Shoulder"]
    CI = ["C", "C", "C", "C"]
    sets = [2, 2, 2, 2]
    
    for i in range(0, 4):
        exercise[i] = generate(parts[i], CI[i], sets[i], 8)
        
        while (checkTypeDupe1(exercise[i].type) == true || 
               checkRepeatedExercise(exercise[i]) == true):
            exercise[i] = generate(parts[i], CI[i], sets[i], 8)
        
        usedType.append(exercise[i].type)
        usedExercise.append(exercise[i])


checkTypeDupe1(val):
    count = 0
    for i in range(0, len(usedType)):
        if val == usedType[i]:
            count++
    
    if count >= 1:
        return true
    return false


checkRepeatedExercise(val):
    for i in range(0, len(usedExercise)):
        if val == usedExercise[i]:
            return true
    return false


=== 45-60 MIN FULL BODY ===

Day A:
    usedType = []
    usedExercise = []
    parts = ["Chest", "Chest", "Back", "Back", "Shoulder", "Legs"]
    CI = ["C", "I", "C", "I", "C", "C"]
    sets = [3, 2, 3, 2, 3, 3]
    
    for i in range(0, 6):
        exercise[i] = generate(parts[i], CI[i], sets[i], 8)
        
        while (checkTypeDupe2(exercise[i].type) == true):
            exercise[i] = generate(parts[i], CI[i], sets[i], 8)
        
        usedType.append(exercise[i].type)
        usedExercise.append(exercise[i])


Day B:
    usedType = []
    parts = ["Legs", "Legs", "Back", "Chest", "Shoulder", "Shoulder-Lateral", "Shoulder-Rear"]
    CI = ["C", "I", "C", "C", "C", "I", "I"]
    sets = [3, 2, 3, 3, 3, 2, 1]
    
    for i in range(0, 7):
        exercise[i] = generate(parts[i], CI[i], sets[i], 8)
        
        while (checkTypeDupe2(exercise[i].type) == true || 
               checkRepeatedExercise(exercise[i]) == true):
            exercise[i] = generate(parts[i], CI[i], sets[i], 8)
        
        usedType.append(exercise[i].type)
        usedExercise.append(exercise[i])


checkTypeDupe2(val):
    count = 0
    for i in range(0, len(usedType)):
        if val == usedType[i]:
            count++
    
    if count >= 2:
        return true
    return false


checkRepeatedExercise(val):
    for i in range(0, len(usedExercise)):
        if val == usedExercise[i]:
            return true
    return false


=== 60+ MIN FULL BODY ===

Day A:
    usedType = []
    usedExercise = []
    
    // Determine leg isolation based on last used
    if lastLegIsolation == "Quad":
        legIsolation = "Legs-Hamstring"
    else:
        legIsolation = "Legs-Quad"
    
    parts = ["Chest", "Chest", "Back", "Back", "Shoulder", "Shoulder-Lateral", "Shoulder-Rear", "Legs", legIsolation]
    CI = ["C", "I", "C", "I", "C", "I", "I", "C", "I"]
    sets = [3, 2, 3, 2, 3, 2, 1, 3, 2]
    
    for i in range(0, 9):
        exercise[i] = generate(parts[i], CI[i], sets[i], 8)
        
        while (checkTypeDupe3(exercise[i].type) == true):
            exercise[i] = generate(parts[i], CI[i], sets[i], 8)
        
        usedType.append(exercise[i].type)
        usedExercise.append(exercise[i])


Day B:
    usedType = []
    
    // Opposite leg isolation from Day A
    if legIsolation == "Legs-Quad":
        legIsolationB = "Legs-Hamstring"
    else:
        legIsolationB = "Legs-Quad"
    
    parts = ["Legs", legIsolationB, "Back", "Back", "Chest", "Chest", "Shoulder", "Shoulder-Lateral", "Bicep", "Tricep"]
    CI = ["C", "I", "C", "I", "C", "I", "C", "I", "I", "I"]
    sets = [3, 2, 3, 2, 3, 2, 3, 2, 2, 2]
    
    for i in range(0, 10):
        exercise[i] = generate(parts[i], CI[i], sets[i], 8)
        
        while (checkTypeDupe3(exercise[i].type) == true || 
               checkRepeatedExercise(exercise[i]) == true):
            exercise[i] = generate(parts[i], CI[i], sets[i], 8)
        
        usedType.append(exercise[i].type)
        usedExercise.append(exercise[i])
    
    // Save leg isolation for next time
    save(legIsolation)


checkTypeDupe3(val):
    count = 0
    for i in range(0, len(usedType)):
        if val == usedType[i]:
            count++
    
    if count >= 3:
        return true
    return false


checkRepeatedExercise(val):
    for i in range(0, len(usedExercise)):
        if val == usedExercise[i]:
            return true
    return false -->