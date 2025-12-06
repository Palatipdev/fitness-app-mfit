export const UPPER_LOWER_TEMPLATES = {
  "30": {
    upperA: [
      { muscle: "Chest", ci: "Compound", sets: 2 },
      { muscle: "Back", ci: "Compound", sets: 2 },
      { muscle: "Shoulder", ci: "Compound", sets: 2 },
      { muscle: "Triceps", ci: "Isolation", sets: 2 },
    ],
    upperB: [
      { muscle: "Back", ci: "Compound", sets: 2 },
      { muscle: "Chest", ci: "Isolation", sets: 2 },
      { muscle: "Shoulder", ci: "Compound", sets: 2 },
      { muscle: "Biceps", ci: "Isolation", sets: 2 },
    ],
    lowerA: [
      { muscle: "Legs", ci: "Compound", sets: 2 },
      { muscle: "Quads", ci: "Isolation", sets: 2 },
      { muscle: "thighIsolation", ci: "Isolation", sets: 2, weekDependent: true }, // Inner/Outer
      { muscle: "Abdominal", ci: "Isolation", sets: 2 },
    ],
    lowerB: [
      { muscle: "Legs", ci: "Compound", sets: 2 },
      { muscle: "Hamstrings", ci: "Isolation", sets: 2 },
      { muscle: "Glutes", ci: "Isolation", sets: 2 },
      { muscle: "Calfs", ci: "Isolation", sets: 2 },
    ],
  },
  
  "30-60": {
    upperA: [
      { muscle: "Chest", ci: "Compound", sets: 2 },
      { muscle: "Chest", ci: "Isolation", sets: 2 },
      { muscle: "Shoulder", ci: "Compound", sets: 2 },
      { muscle: "Back", ci: "Compound", sets: 3 },
      { muscle: "Triceps", ci: "Isolation", sets: 2 },
    ],
    upperB: [
      { muscle: "Back", ci: "Compound", sets: 3 },
      { muscle: "Back", ci: "Isolation", sets: 2 },
      { muscle: "Chest", ci: "Isolation", sets: 2 },
      { muscle: "Shoulder", ci: "Compound", sets: 2 },
      { muscle: "Biceps", ci: "Isolation", sets: 2 },
    ],
    lowerA: [
      { muscle: "Legs", ci: "Compound", sets: 3 },
      { muscle: "Quads", ci: "Isolation", sets: 3 },
      { muscle: "thighIsolation", ci: "Isolation", sets: 2, weekDependent: true },
      { muscle: "Abdominal", ci: "Isolation", sets: 2 },
    ],
    lowerB: [
      { muscle: "Legs", ci: "Compound", sets: 3 },
      { muscle: "Hamstrings", ci: "Isolation", sets: 3 },
      { muscle: "Glutes", ci: "Isolation", sets: 2 },
      { muscle: "Calfs", ci: "Isolation", sets: 2 },
    ],
  },
  
  "60+": {
    upperA: [
      { muscle: "Chest", ci: "Compound", sets: 3 },
      { muscle: "Chest", ci: "Isolation", sets: 2 },
      { muscle: "Shoulder", ci: "Compound", sets: 2 },
      { muscle: "Shoulder-Lateral", ci: "Isolation", sets: 2 },
      { muscle: "Back", ci: "Compound", sets: 2 },
      { muscle: "Back", ci: "Isolation", sets: 2 },
      { muscle: "Triceps", ci: "Isolation", sets: 2 },
    ],
    upperB: [
      { muscle: "Back", ci: "Compound", sets: 3 },
      { muscle: "Back", ci: "Isolation", sets: 3 },
      { muscle: "Shoulder", ci: "Compound", sets: 3 },
      { muscle: "Shoulder-Rear", ci: "Isolation", sets: 2 },
      { muscle: "Chest", ci: "Compound", sets: 2 },
      { muscle: "Chest", ci: "Isolation", sets: 2 },
      { muscle: "Biceps", ci: "Isolation", sets: 2 },
    ],
    lowerA: [
      { muscle: "Legs", ci: "Compound", sets: 3 },
      { muscle: "Quads", ci: "Isolation", sets: 2 },
      { muscle: "Hamstrings", ci: "Isolation", sets: 2 },
      { muscle: "Inner Thigh", ci: "Isolation", sets: 2 },
      { muscle: "Calfs", ci: "Isolation", sets: 2 },
      { muscle: "Abdominal", ci: "Isolation", sets: 2 },
    ],
    lowerB: [
      { muscle: "Legs", ci: "Compound", sets: 3 },
      { muscle: "Hamstrings", ci: "Isolation", sets: 2 },
      { muscle: "Glutes", ci: "Isolation", sets: 2 },
      { muscle: "Quads", ci: "Isolation", sets: 2 },
      { muscle: "Outer Thigh", ci: "Isolation", sets: 2 },
      { muscle: "Abdominal", ci: "Isolation", sets: 2 },
    ],
  },
};
export const FULL_BODY_TEMPLATES ={
    "30min":{
            upperA: [{}],
    upperB: [{}],
    lowerA: [{}],
    lowerB: [{}],
    },
    "45min":{
            upperA: [{}],
    upperB: [{}],
    lowerA: [{}],
    lowerB: [{}],
    },
    "60min":{
            upperA: [{}],
    upperB: [{}],
    lowerA: [{}],
    lowerB: [{}],
    }
}
