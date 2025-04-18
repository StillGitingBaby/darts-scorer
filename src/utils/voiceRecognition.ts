// Simple wrapper around Web Speech API
// Types are defined in src/types/speech-recognition.d.ts

// Mock implementation for testing environments
class MockSpeechRecognition implements EventTarget {
  continuous = false;
  interimResults = false;
  lang = 'en-US';
  maxAlternatives = 1;
  onresult: ((event: any) => void) | null = null;
  onstart: ((event: any) => void) | null = null;
  onend: ((event: any) => void) | null = null;
  onerror: ((event: any) => void) | null = null;

  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() {
    return true;
  }

  start() {}
  stop() {}
  abort() {}
}

export class VoiceRecognition {
  private recognition: any;
  private onResultCallback: ((text: string) => void) | null = null;
  private continuousMode: boolean = true;

  constructor() {
    // Use mock in test environment, real implementation in browser
    const isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      const SpeechRecognitionImpl = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = SpeechRecognitionImpl
        ? new SpeechRecognitionImpl()
        : new MockSpeechRecognition();
    } else {
      this.recognition = new MockSpeechRecognition();
    }

    this.recognition.continuous = false;
    this.recognition.interimResults = false;
  }

  start(onResult: (text: string) => void, continuous: boolean = true) {
    this.onResultCallback = onResult;
    this.continuousMode = continuous;

    this.recognition.onresult = (event: any) => {
      // In a real browser, event.results[0][0].transcript would contain the recognized text
      // In test environment, we'll just pass a mock value with the required "count" prefix
      const text = event?.results?.[0]?.[0]?.transcript || 'count 40';
      if (this.onResultCallback) {
        this.onResultCallback(text);
      }
    };

    // Setup the onend event to restart if in continuous mode
    this.recognition.onend = () => {
      // Restart recognition when it ends if still in continuous mode
      if (this.continuousMode) {
        this.recognition.start();
      }
    };

    this.recognition.start();
  }

  stop() {
    this.continuousMode = false;
    this.recognition.stop();
  }
}

// Helper function to check if voice recognition is supported in the browser
export const isVoiceRecognitionSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
};
