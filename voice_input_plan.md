# Voice Input Implementation Plan

## Overview

Add voice recognition to the darts scorer app, allowing players to speak their scores instead of typing them. This will make the game more convenient, especially in social settings.

## Simple Implementation Approach

### 1. Add Voice Recognition Service

Create `src/utils/voiceRecognition.ts`:

```typescript
// Simple wrapper around Web Speech API
export class VoiceRecognition {
  private recognition: SpeechRecognition;

  constructor() {
    this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
  }

  start(onResult: (text: string) => void) {
    this.recognition.onresult = event => {
      const text = event.results[0][0].transcript;
      onResult(text);
    };
    this.recognition.start();
  }

  stop() {
    this.recognition.stop();
  }
}
```

### 2. Modify ScoreInput Component

Update `src/components/ScoreInput.tsx` to add a microphone button:

```typescript
// Add to existing imports
import { VoiceRecognition } from '../utils/voiceRecognition';

// Add inside ScoreInput component
const [isListening, setIsListening] = useState(false);
const voiceRecognition = useRef(new VoiceRecognition());

const handleVoiceInput = (text: string) => {
  // Try to extract a number from the spoken text
  const number = parseInt(text.replace(/[^0-9]/g, ''));
  if (!isNaN(number)) {
    setScore(number.toString());
    // Auto-submit if it's a valid score
    if (isValidScore(number)) {
      onScoreSubmit(number);
      setScore('');
      setError('');
      setShouldFocus(true);
    } else {
      setError(getErrorMessage(number));
    }
  }
};

// Add to the JSX next to the submit button
<button
  type="button"
  onClick={() => {
    if (isListening) {
      voiceRecognition.current.stop();
    } else {
      voiceRecognition.current.start(handleVoiceInput);
    }
    setIsListening(!isListening);
  }}
  className={`ml-2 p-2 rounded ${
    isListening ? 'bg-red-600' : 'bg-gray-600'
  } text-white`}
>
  🎤
</button>
```

### 3. Testing Plan

1. Test basic voice recognition:

   - Say numbers clearly
   - Verify they appear in the input field
   - Check if valid scores are auto-submitted

2. Test error cases:
   - Invalid scores
   - Non-numeric speech
   - Background noise

### 4. Browser Support

- Chrome (desktop and Android)
- Edge
- Safari (desktop and iOS)
- Firefox (with flags)

Add a simple browser check:

```typescript
const isVoiceRecognitionSupported = () => {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
};
```

Only show the microphone button if supported.

## Implementation Steps

1. **Day 1: Basic Setup**

   - Create voiceRecognition.ts
   - Add microphone button to ScoreInput
   - Test basic number recognition

2. **Day 2: Polish**

   - Add visual feedback when listening
   - Handle error cases
   - Test across browsers

3. **Day 3: Testing & Fixes**
   - Test with real users
   - Fix any issues
   - Add browser compatibility check

## Future Improvements

1. Add visual feedback when listening (pulsing microphone icon)
2. Support voice commands like "undo"
3. Add calibration for different voices
4. Support multiple languages

## Notes

- Keep it simple - focus on basic number recognition first
- Don't overcomplicate the UI
- Make it easy to switch between voice and manual input
- Handle errors gracefully
- Test thoroughly with different voices and environments
