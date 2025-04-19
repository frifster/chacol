import React from 'react';
import { Game as GameComponent } from '../components/Game';

const Game: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <div className="absolute top-4 left-4 z-50 text-white pointer-events-none">
        <h1 className="text-2xl font-bold">Chacol: The Dungeon Chronicles</h1>
        <p className="text-sm opacity-75">Press ESC to exit</p>
      </div>
      <div className="absolute inset-0">
        <GameComponent />
      </div>
    </div>
  );
};

export default Game; 