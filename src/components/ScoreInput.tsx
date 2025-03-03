import React, { useState } from 'react';

interface ScoreInputProps {
  onScoreSubmit: (score: number) => void;
}

const ScoreInput: React.FC<ScoreInputProps> = ({ onScoreSubmit }) => {
  const [score, setScore] = useState<string>('');

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

  // Common dart scores for quick input
  const quickScores = [
    0, 1, 2, 3, 4, 5, 
    6, 7, 8, 9, 10, 11, 
    12, 13, 14, 15, 16, 
    17, 18, 19, 20, 25, 
    50, 60, 57, 54, 51
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
    </div>
  );
};

export default ScoreInput; 