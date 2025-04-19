import React, { useEffect, useRef } from 'react';
import { GameEngine } from '../engine/GameEngine';

export const Game: React.FC = () => {
    const gameEngineRef = useRef<GameEngine | null>(null);

    useEffect(() => {
        // Initialize game engine
        gameEngineRef.current = new GameEngine();
        gameEngineRef.current.start();

        // Cleanup on unmount
        return () => {
            if (gameEngineRef.current) {
                gameEngineRef.current.stop();
            }
        };
    }, []);

    return (
        <div className="game-container">
            {/* The game canvas will be automatically added to the body by Three.js */}
        </div>
    );
}; 