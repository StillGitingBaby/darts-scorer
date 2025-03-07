import React, { useState } from 'react';

interface ScoreInputProps {
  onScoreSubmit: (score: number) => void;
}

const IMPOSSIBLE_SCORES = [179, 178, 176, 175, 173, 172, 169, 166, 163];
const MAX_POSSIBLE_SCORE = 180;

const ScoreInput: React.FC<ScoreInputProps> = ({ onScoreSubmit }) => {
  const [score, setScore] = useState<string>('');
  const [error, setError] = useState<string>('');

  const isValidScore = (score: number): boolean => {
    return !IMPOSSIBLE_SCORES.includes(score) && score <= MAX_POSSIBLE_SCORE;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericScore = parseInt(score);
    
    if (!isNaN(numericScore) && numericScore >= 0) {
      if (numericScore > MAX_POSSIBLE_SCORE) {
        setError(`${numericScore} exceeds maximum possible score of ${MAX_POSSIBLE_SCORE}`);
      } else if (IMPOSSIBLE_SCORES.includes(numericScore)) {
        setError(`${numericScore} is not a possible 3-dart score`);
      } else {
        onScoreSubmit(numericScore);
        setScore('');
        setError('');
      }
    }
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
            type="number"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="border rounded px-3 py-2 w-20 mr-2"
            min="0"
            max={MAX_POSSIBLE_SCORE}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
        {error && (
          <div className="text-red-600 mt-2" role="alert">
            {error}
          </div>
        )}
      </form>

    </div>
  );
};

export default ScoreInput; 