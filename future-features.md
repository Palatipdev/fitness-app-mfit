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