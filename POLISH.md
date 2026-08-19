Polish & UI Improvements

## Welcome Screen
- [ ] Lava bubble background animation
- [x] Smoother button animations (PressScale, native-driver scale + haptics)
- [x] Better font sizing for different screens (type scale + maxFontSizeMultiplier)

## Sign In / Sign Up Screens
- [x] "Or sign in with" divider line (removed; the buttons were never wired up)
- [ ] Google login button
- [ ] Facebook login button
- [ ] Apple login button
- [x] Better spacing between elements
- [ ] Error shake animation
- [x] Loading spinner on submit
- [ ] Some animation or text after successfully signed in
- [x] Inline per-field validation instead of Alert popups
- [x] Show/hide password toggle, autofill and password manager support

## Onboarding
- [x] Smooth slide transitions (five-step wizard with progress bar)
- [ ] Picker wheel for height/weight
- [x] Choosing between lbs and kg for Weight
- [x] Choosing between cm and inches for height
- [x] fix text input format
- [x] Android hardware back walks the steps instead of exiting the flow

## Result Preview
- [ ] Confetti when opened
- [ ] Sliding transition and bouncing effect on the header
- [x] Removed nutrition, shows the real generated plan

## Progress Analytic
- [x] Add exercise name instead of exercise index for the label
- [x] Volume, total time and week streak tiles
- [x] Bars on the muscle group breakdown

## Code Cleanup
- [x] Create `usePoppinsFont` hook (became `useAppFonts`, loads once at the root)
- [x] Create `ScreenWrapper` component for font loading (became `Screen`)
- [x] Extract button styles to reusable component
- [x] Create constants for common spacing values
- [x] Move inline styles to StyleSheet
- [x] Fix import paths (../../constants to @/constants)
- [x] Replace 2DayFB with a proper template and create a generator function
      for all variants (`constants/splits.ts` + `buildWeek`)

## General
- [x] Consistent spacing across all screens
- [x] Dark mode support (dark default, light and system in profile)
- [x] Accessibility improvements (roles, labels, live regions, 48dp targets)
- [x] Loading states for all buttons
- [x] Error handling UI (ErrorState with retry, inline field errors)
- [ ] Blue flame streaks

## Icon interaction
- [x] When pressing the icon of the current page, don't reload the page

## Generator / Exercise Database
- [ ] Adding differentiator variable for upper back and lats
- [ ] Add more glutes exercises

## Still open
- [ ] Rest timer duration is fixed at 90s; make it per exercise
- [ ] No offline queue. A workout saved without a connection is lost
- [ ] Exercise swap during a session
- [ ] Firestore security rules are not in the repo
