import confetti from 'canvas-confetti';
import React, { useState, useCallback, useRef, useEffect } from 'react';

import { VoiceRecognition, isVoiceRecognitionSupported } from '../utils/voiceRecognition';

interface ScoreInputProps {
  onScoreSubmit: (score: number) => void;
  autoFocus?: boolean;
}

const IMPOSSIBLE_SCORES = [179, 178, 176, 175, 173, 172, 169, 166, 163];
const MAX_POSSIBLE_SCORE = 180;

const ScoreInput: React.FC<ScoreInputProps> = ({ onScoreSubmit, autoFocus = false }) => {
  const [score, setScore] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [lastHeardText, setLastHeardText] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [shouldFocus, setShouldFocus] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const voiceRecognition = useRef<VoiceRecognition | null>(null);
  const voiceSupported = isVoiceRecognitionSupported();

  // Initialize voice recognition
  useEffect(() => {
    if (voiceSupported) {
      voiceRecognition.current = new VoiceRecognition();
    }
    return () => {
      if (voiceRecognition.current && isListening) {
        voiceRecognition.current.stop();
      }
    };
  }, [voiceSupported]);

  // Effect to handle focusing the input
  useEffect(() => {
    if (shouldFocus && inputRef.current) {
      inputRef.current.focus();
      setShouldFocus(false);
    }
  }, [shouldFocus]);

  // Effect to handle initial focus when component mounts
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const isValidScore = (score: number): boolean => {
    return !IMPOSSIBLE_SCORES.includes(score) && score <= MAX_POSSIBLE_SCORE;
  };

  const getErrorMessage = (score: number): string => {
    if (score > MAX_POSSIBLE_SCORE) {
      return `${score} exceeds maximum possible score of ${MAX_POSSIBLE_SCORE}`;
    }
    if (IMPOSSIBLE_SCORES.includes(score)) {
      return `${score} is not a possible 3-dart score`;
    }
    return '';
  };

  const launchConfetti = () => {
    confetti({
      particleCount: 200,
      spread: 100,
      startVelocity: 50,
      scalar: 1.2, // Size of confetti pieces
      colors: ['#ff0000', '#ffbf00', '#00ff00'], // Red, Yellow, Green
      origin: { y: 0.6 },
    });
  };

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const numericScore = parseInt(score);

      if (!isNaN(numericScore) && numericScore >= 0) {
        if (isValidScore(numericScore)) {
          onScoreSubmit(numericScore);
          if (numericScore === 180) {
            launchConfetti();
          }
          setScore('');
          setError('');
          // Trigger focus after state updates
          setShouldFocus(true);
        } else {
          setError(getErrorMessage(numericScore));
        }
      }
    },
    [score, onScoreSubmit, isValidScore, getErrorMessage, setScore, setError, launchConfetti]
  );

  const handleVoiceInput = (text: string) => {
    setLastHeardText(text);
    // Process the voice input
    processVoiceInput(text);
  };

  // Helper function to process voice input and extract scores
  const processVoiceInput = useCallback(
    (text: string) => {
      // Convert to lowercase for case-insensitive matching
      const lowerText = text.toLowerCase();

      // Check if the text includes "count"
      if (!lowerText.includes('count')) {
        setError("Please start with 'count' followed by your score");
        return;
      }

      // Handle "count zero" case specifically
      if (lowerText.includes('count zero')) {
        setScore('0');
        onScoreSubmit(0);
        setError('');
        setScore('');
        setShouldFocus(true);
        return;
      }

      // Extract the number that follows "count"
      const match = lowerText.match(/count\s+(\d+)/i);
      if (!match || !match[1]) {
        setError("Please say 'count' followed by a number");
        return;
      }

      // Parse the number
      const number = parseInt(match[1]);
      if (isNaN(number)) {
        setError('Could not understand the number');
        return;
      }

      // Set the score and validate
      setScore(number.toString());

      // Check if it's a valid score
      if (!isValidScore(number)) {
        setError(getErrorMessage(number));
        return;
      }

      // Submit the valid score
      onScoreSubmit(number);
      if (number === 180) {
        launchConfetti();
      }

      // Reset the input
      setScore('');
      setError('');
      setShouldFocus(true);
    },
    [onScoreSubmit, isValidScore, getErrorMessage, launchConfetti]
  );

  const toggleListening = useCallback(() => {
    if (isListening) {
      voiceRecognition.current?.stop();
      setIsListening(false);
    } else {
      voiceRecognition.current?.start(handleVoiceInput);
      setIsListening(true);
    }
  }, [isListening, handleVoiceInput]);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Score Input</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex flex-col sm:flex-row">
          <div className="flex items-center mb-2 sm:mb-0">
            <label htmlFor="score-input" className="mr-2 font-medium">
              Enter Score:
            </label>
            <input
              id="score-input"
              type="number"
              value={score}
              onChange={useCallback(
                (e: React.ChangeEvent<HTMLInputElement>) => setScore(e.target.value),
                [setScore]
              )}
              className="border rounded px-3 py-2 w-20 mr-2"
              min="0"
              max={MAX_POSSIBLE_SCORE}
              ref={inputRef}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </div>

          {voiceSupported && (
            <div className="flex items-center sm:ml-4">
              <button
                type="button"
                onClick={toggleListening}
                className={`flex items-center px-3 py-2 rounded ${
                  isListening ? 'bg-red-600' : 'bg-blue-600'
                } text-white`}
                aria-label={isListening ? 'Stop listening' : 'Start voice input'}
              >
                <span className="mr-2">🎤</span>
                {isListening ? 'Stop Voice' : 'Voice Input'}
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="text-red-600 mt-2" role="alert">
            {error}
          </div>
        )}
        {isListening && (
          <div className="text-green-600 mt-2">
            Listening... Say "count" followed by your score (e.g., "count 40" or "count zero").
          </div>
        )}
        {lastHeardText && !isListening && (
          <div className="text-gray-600 mt-2">
            <span className="font-semibold">Last heard:</span> "{lastHeardText}"
          </div>
        )}
      </form>
    </div>
  );
};

export default ScoreInput;
