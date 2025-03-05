import React, { useState, useEffect, useRef } from 'react';

interface ScoreInputProps {
  onScoreSubmit: (score: number) => void;
}

const ScoreInput: React.FC<ScoreInputProps> = ({ onScoreSubmit }) => {
  const [score, setScore] = useState<string>(''); // To track the current score being typed or spoken
  const [isListening, setIsListening] = useState<boolean>(false); // To track the listening state
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null); // Speech recognition instance
  const [spokenScores, setSpokenScores] = useState<number[]>([]); // To store individual scores spoken by the user
  const [lastThreeScores, setLastThreeScores] = useState<number[]>([]); // To store the last 3 scores for display

  const scoreInputRef = useRef<HTMLInputElement>(null); // Ref for the input field

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.lang = 'en-US';
      recognitionInstance.interimResults = false;

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const speechToText = event.results[0][0].transcript;
        const numericScore = parseInt(speechToText);
        if (!isNaN(numericScore) && numericScore >= 0) {
          // Accumulate the spoken scores and store the last 3 scores
          setSpokenScores((prevScores) => {
            const updatedScores = [...prevScores, numericScore];
            // Update last three scores
            const updatedLastThreeScores = [...updatedScores].slice(-3);
            setLastThreeScores(updatedLastThreeScores);
            return updatedScores;
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
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Sum up all the scores in spokenScores
    const totalScore = spokenScores.reduce((sum, current) => sum + current, 0);
    if (totalScore >= 0) {
      onScoreSubmit(totalScore);
      // Reset the spoken scores after submission
      setSpokenScores([]);
    }
  };

  const handleQuickScore = (value: number) => {
    setSpokenScores((prevScores) => {
      const updatedScores = [...prevScores, value];
      // Update last three scores
      const updatedLastThreeScores = [...updatedScores].slice(-3);
      setLastThreeScores(updatedLastThreeScores);
      return updatedScores;
    });
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
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="border rounded px-3 py-2 w-20 mr-2"
                min="0"
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
          <h3 className="font-medium mb-2">Total Score: {spokenScores.reduce((sum, current) => sum + current, 0)}</h3>
        </div>

        <div className="mt-4">
          <h3 className="font-medium mb-2">Last 3 Dart Attempts:</h3>
          <ul>
            {lastThreeScores.map((score, index) => (
                <li key={index}>
                  Dart {index + 1}: {score}
                </li>
            ))}
          </ul>
        </div>
      </div>
  );
};

export default ScoreInput;
