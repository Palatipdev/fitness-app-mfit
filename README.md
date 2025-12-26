# mfit - AI-Powered Fitness App

a fitness app, that includes nutrition tracking, calorie logging, and personalized workout plans, experience level, and availiable equipment.

## 🎯 Project Overview

## ✨ Key Features
- 🏋️ **AI Workout Generation** - Personalized routines based on schedule and experience
- 📊 **Smart Logging** - Track sets, reps, and weights with real-time timer
- 💾 **Progress Tracking** - Save workouts to Firebase, compare performance over time
- 🎯 **Adaptive Programming** - Week A/B periodization for progressive overload

**Timeline:** 6-month development plan (Nov 2024 - May 2025)
**Goal:** Launch on App Store with real users

## 🛠️ Tech Stack
- **Frontend:** React Native (Expo), TypeScript
- **Backend:** Firebase (Authentication, Firestore)
- **State Management:** React Hooks
- **Navigation:** Expo Router




### Phase 1: Authentication & Onboarding (Week 1-2)

- [x] Welcome screen
- [x] Sign In screen
- [x] Onboarding survey
- [x] Result preview screen
- [x] Sign Up screen
- [x] Firebase authentication

### Phase 2: Core Features (Week 3-10)

- [x] Personalized workout generation
- [ ] Nutrition tracking
- [ ] Progress analytics
- [x] Workout logging

### Phase 3: AI Integration (Week 11-12)

- [ ] AI workout coach
- [ ] Form feedback
- [ ] Conversational nutrition advice

### Phase 4: Polish & Launch (Week 13-16)

- [ ] UI/UX refinements
- [ ] App Store submission
- [ ] Marketing materials

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI

### Installation

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on device
# Scan QR code with Expo Go app (iOS/Android)
```

## 📁 Project Structure

```
MFIT-FITNESS-APP/
├── app/              # Screens and routes (Expo Router)
├── components/       # Reusable UI components
├── constants/        # Colors, themes, config
├── assets/          # Images, fonts
└── POLISH.md        # Week 13-14 improvement backlog
```

## 📊 Progress Tracking

**Current Phase:** Week 5-6 - Progress Tracking & Analytics
**Daily Commits:** ✅ (Tracking on GitHub)

## 🎓 Learning Journey

This is my first production mobile app, Building in public to:

- Develop practical software engineering skills
- Learn mobile development & AI integration
- Create a portfolio project for internship applications

## 📝 Development Log

- **Day 1 (Nov 23):** Welcome, Sign In, and Onboarding screens completed. Navigation working.
- **Day 2 (Nov 24):** Onboarding screens polished, Result preview screen created (WIP), project structure setup
- **Day 3 (Nov 25):**
- Completed results preview screen with LinearGradient fade effect.
- Created reusable FloatingLabelInput component for label transitions
- Implemented floating labels on Sign In and Sign Up screens,
- Added navigationglow: Sign In -> Onboarding and Sign up -> Sign In
- **Day 4 (Nov 26):**
- Fixed FloatingLabelInput rendering on mobile using zIndex
- Fixed spacing and polishing of all screens on mobile
- **Day 6 (Nov 27):**
- Firebase authenticator implementation on Sign-in (using email and password validation) and Sign-up (username stored in firebase) screen.
- There was a major bug that I encountered. "Component auth has not been registered yet". Even with simple web SDK config, so I tried using lazy loading method, which broke the export. The fix was to download a more stable & older version of firebase (10.13.2) and used simple web SDK config, approx time to fix 3 hours.
- **Day 8 (Nov 30):**
  - Created homepage with scrollable content and fixed navbar
  - Added calorie tracker section with progress bar placeholder
  - Added workout routine template display (Monday-Sunday split)
  - Implemented Instagram-style fixed bottom navigation
- **Day 9 (Dec 1):**
  - Added protected route to prevent unauthorised access
- **Day 10 (Dec 2):**

  - Added exercise database of 89 exercises each exercise includes:
    - Primary, Secondary, and Tertiary Muscle Groups.
    - Type of equipment (Machine,Barbell,Dumbbell,Bodyweight)
    - Strength or Hypertrophy focused
    - Compound or Isolation focused

- **Day 11 (Dec 3):**
- Added pseudocode for workout generation algorithm:
  - 2 days per week:
    - Less than 30 mins
- **Day 12 (Dec 5)**
- Finished all version of 2 days per week psuedocode
- Made Day 11's pseudocode better and clearer
- Converted and stored 89 exercises from google sheets to firebase database

- **Day 13 (Dec 6) Session 1**
- Workout Generator for 2Days FB done
  - Fetch exercise from Firebase
  - Generate Day A and Day B workouts for 2 Days FB routine
  - Avoid equipment duplicates within the days
  - Avoid exercise duplictes across days
  - Created workout helper functions (checkTypeDupe1/2/3, checkRepeatedExercise)
- **Day 13 (Dec 6) Session 2**
- Built template-driven workout generator architecture
- Built UPPER_LOWER_TEMPLATES for all 3 durations (30/45/60+ min)
- Implemented core generator infrastructure:
  - fetchExercise() - Firebase integration
  - getOnboardingData() - user preference retrieval
  - generatorDay() - single day workout generation with week-dependent logic
  - generateWorkout() - main function for full workout plans
- Upper/Lower split working for all durations (30/45/60+ min)

- **Day 14 (Dec 8)**
- Built workout template for PPL (30/45/60 mins)
- Implemented generator for PPL with all time variants
- All generator are finished and working

- **Day 15 (Dec 9)**
- Created workoutServices.ts for managing generated workout logic, seperating UI and Service

- **Day 16 (Dec 10)**
- Built getweek() function with date/time logic
- Created saveWorkout() with Firestore structure
- Started homepage integration with useEffect()
- Debugged Typescript issues, async patterns, Firestore paths

- **Day 16 (Dec 10) Session 2:**
- Built loadCurrentWorkout() to fetch workouts from Firestore
- Integrated full backend flow: check → generate → save → load
- Successfully tested end-to-end: workouts generating and persisting to Firebase
- **Backend for workout system 100% complete ✅**


- **Day 17 (Dec 11)**
- All generated workout are displayed, replacing the previous hardcoded-template
- Tested with 9 accounts with different time and day variants
- Added 6 Glutes exercise to the database

- **Day 18 (Dec 14)**
- Added "Start Workout" pressable button to start workout logging process.
- Created workoutLogging page.
- Positioned button layout with proper spacing.

**Day 19 (Dec 15):**
- Created workout logging screen
- Implemented real-time timer (HH:MM:SS format)
- Added top navigation bar with logo, timer, and finish button

**Day 20 (Dec 16):**
- Refactored homepage to use reusable WorkoutDay component
- Added current week detection (Week A vs Week B)
- Conditional rendering: only display workouts for current week
- Reduced homepage from ~1000 lines to ~400 lines
- Fixed workout generation bug (no longer regenerates on week change)

**Day 20 (Dec 16) Session 2:**
- Built workout logging UI with exercise list
- Added weight/reps input fields
- Fixed screen flickering issue
- Optimized state management with useEffect


**Day 21 (Dec 17):**
- Implemented workout logging system with per-exercise set tracking
- Built handleAddSet function to store weight/reps for each exercise
- Added dynamic set display showing set number, weight, and reps
- Fixed input field state management (independent inputs per exercise)

**Day 22 (Dec 20):**
- Implemented per-exercise input state management (independent fields per exercise)
- Fixed input clearing after adding sets
- Improved set display alignment using flex layout
- Built handleFinishWorkout function to save completed workouts to Firestore
- Workout data saves: exercises, sets, weight, reps, duration, date, workout name
- Successfully tested end-to-end: generate → log → save → retrieve from database
- Core logging system complete and functional

**Day 23 (Dec 22):**

- Created workoutAnalytic folder with fetchingServices.ts
- Implemented fetchPastWorkouts() to retrieve logs from Firestore
- Built progressAnalytics screen with workout history list
- Successfully displaying past workouts (date, dayName)
- Fixed TypeScript errors with collection() and async useEffect

**Day 24 (Dec 26):**
- Progress analytics expansion - exercise names and muscle group tracking
  - Added exerciseName and primaryMuscleGroup to workout logs
  - Modified handleAddSet to save full exercise metadata
  - Updated getHeaviestSet to display actual exercise names
  - Planned 1RM-based muscle group progress calculation (sum of 1RMs approach)

## 🔗 Links

- GitHub: (https://github.com/Palatipdev/fitness-app-mfit)
- Project Plan: See POLISH.md for Week 13-14 improvements

## 📄 License


This is a personal portfolio project built for educational purposes and internship applications.

Not currently licensed for commercial use.
---

**Built by Palatip Boonmeerit | CS @ UniMelb**
