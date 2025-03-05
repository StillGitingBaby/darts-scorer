import React, { useState, useEffect } from 'react';

interface ScoreInputProps {
  onScoreSubmit: (score: number) => void;
}

const ScoreInput: React.FC<ScoreInputProps> = ({ onScoreSubmit }) => {
  const [score, setScore] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

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
          setScore(speechToText);
          onScoreSubmit(numericScore);
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
    const numericScore = parseInt(score);
    if (!isNaN(numericScore) && numericScore >= 0) {
      onScoreSubmit(numericScore);
      setScore('');
    }
  };

  const handleQuickScore = (value: number) => {
    onScoreSubmit(value);
  };

  const toggleListening = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
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
      </div>
  );
};

export default ScoreInput;
