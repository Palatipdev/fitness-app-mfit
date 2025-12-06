# Future Features (Post-Launch)

## Machine Recognition AI (Priority: HIGH)
**Dependencies:** Core workout logging must work first

### Feature Description:
- Snap photo of gym machine
- AI recognizes machine type (chest press, leg press, etc.)
- Auto-populates exercise name
- User only logs sets/reps/weight
- Fallback to manual selection for unrecognized equipment

### Technical approach
- Use GPT-4 Vision API
- Train on gym equipment images
- Confidence threshold: >80% = auto-fill


## Regenerate Exercise (Priority:High)
**Dependencies:** Core workout logging must work first

### Feature Description:
- A pressable button next to the exercise
- Let user regenerate specific exercise
- Keeping the same muscle group/CI
- Can have different type

### Technical approach
- A helper function to regenerate a exercise