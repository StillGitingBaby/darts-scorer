import React from 'react';

import GameBoard from './components/GameBoard';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">Darts Scorer</h1>
      </header>
      <main className="container mx-auto p-4">
        <GameBoard />
      </main>
    </div>
  );
}

export default App;
