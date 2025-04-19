import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameEngine } from '../engine/GameEngine';

export const Game: React.FC = () => {
    const gameEngineRef = useRef<GameEngine | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Initialize game engine
        gameEngineRef.current = new GameEngine();
        gameEngineRef.current.start();

        // Handle ESC key to exit
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                navigate('/');
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Cleanup on unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            if (gameEngineRef.current) {
                gameEngineRef.current.stop();
            }
        };
    }, [navigate]);

    return (
        <div className="game-container absolute inset-0">
            {/* The game canvas will be automatically added here by Three.js */}
        </div>
    );
}; 