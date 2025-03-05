import React, { useState, useEffect, useRef } from 'react';

interface ScoreInputProps {
  onScoreSubmit: (score: number, dartScores: number[]) => void; // Pass both total score and individual dart scores
}

const ScoreInput: React.FC<ScoreInputProps> = ({ onScoreSubmit }) => {
  const [isListening, setIsListening] = useState<boolean>(false); // Track listening state
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null); // Speech recognition instance
  const [dartScores, setDartScores] = useState<number[]>([]); // Store the scores for each dart
  const [dartCount, setDartCount] = useState<number>(0); // Track number of darts recorded
  const scoreInputRef = useRef<HTMLInputElement>(null); // Ref for the input field

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.lang = 'en-US';
      recognitionInstance.interimResults = false;

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const speechToText = event.results[0][0].transcript;
        const score = processSpeechToScore(speechToText);

        if (score !== null && dartCount < 3) {
          // Record the score for the current dart attempt
          setDartScores((prevScores) => {
            const updatedScores = [...prevScores, score];
            return updatedScores;
          });
          setDartCount((prevCount) => {
            if (prevCount + 1 === 3) {
              // Stop listening after 3 darts
              recognitionInstance.stop();
            }
            return prevCount + 1;
          });
        }
      };

      recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
      };

      setRecognition(recognitionInstance);
    } else {
      console.warn('Speech recognition not supported in this browser.');
    }
  }, [dartCount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalScore = dartScores.reduce((sum, current) => sum + current, 0);
    if (dartScores.length === 3) {
      onScoreSubmit(totalScore, dartScores);
      setDartScores([]); // Reset the dart scores after submission
      setDartCount(0); // Reset dart count
    }
  };

  const handleQuickScore = (value: number) => {
    if (dartCount < 3) {
      setDartScores((prevScores) => {
        const updatedScores = [...prevScores, value];
        return updatedScores;
      });
      setDartCount((prevCount) => prevCount + 1);
    }
  };

  const toggleListening = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
        // Focus on the score input field when listening starts
        if (scoreInputRef.current) {
          scoreInputRef.current.focus();
        }
      }
      setIsListening(!isListening);
    }
  };

  // Common dart scores for quick input
  const quickScores = [
    0, 1, 2, 3, 4, 5,
    6, 7, 8, 9, 10, 11,
    12, 13, 14, 15, 16,
    17, 18, 19, 20, 25,
    50, 51, 54, 57, 60
  ];

  // Function to process speech input and handle 'double' and 'treble' cases
  const processSpeechToScore = (speech: string): number | null => {
    // Check for "double" or "treble" in the speech
    const match = speech.match(/(double|treble)\s*(\d+)/i);
    if (match) {
      const multiplier = match[1].toLowerCase() === 'double' ? 2 : match[1].toLowerCase() === 'treble' ? 3 : 1;
      const score = parseInt(match[2], 10);
      return score * multiplier;
    }

    // If no match, return the number itself
    const number = parseInt(speech, 10);
    return isNaN(number) ? null : number;
  };

  return (
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Score Input</h2>

        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex items-center">
            <label htmlFor="score-input" className="mr-2 font-medium">
              Enter Score:
            </label>
            <input
                id="score-input"
                ref={scoreInputRef} // Attach the ref to the input
                type="number"
                className="border rounded px-3 py-2 w-20 mr-2"
                disabled
                value={dartScores.join(', ')} // Display all dart scores
            />
            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>

        <div className="mt-4">
          <h3 className="font-medium mb-2">Quick Score</h3>
          <div className="grid grid-cols-6 gap-2 md:grid-cols-9">
            {quickScores.map((value) => (
                <button
                    key={value}
                    onClick={() => handleQuickScore(value)}
                    className="bg-gray-200 hover:bg-gray-300 py-2 rounded text-center"
                >
                  {value}
                </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <button
              onClick={toggleListening}
              className={`bg-green-600 text-white px-4 py-2 rounded ${isListening ? 'bg-red-600' : 'bg-green-600'}`}
          >
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </button>
        </div>

        <div className="mt-4">
          <h3 className="font-medium mb-2">Total Score: {dartScores.reduce((sum, current) => sum + current, 0)}</h3>
        </div>

        <div className="mt-4">
          <h3 className="font-medium mb-2">Dart Attempts:</h3>
          <ul>
            {dartScores.map((score, index) => (
                <li key={index}>Dart {index + 1}: {score}</li>
            ))}
          </ul>
        </div>
      </div>
  );
};

export default ScoreInput;
