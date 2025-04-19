import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameEngine } from '../engine/GameEngine';
import { HUD } from './HUD';

export const Game: React.FC = () => {
    const gameEngineRef = useRef<GameEngine | null>(null);
    const navigate = useNavigate();
    const [isGameLoaded, setIsGameLoaded] = useState(false);

    useEffect(() => {
        // Initialize game engine
        gameEngineRef.current = new GameEngine();
        
        // Simulate loading time
        setTimeout(() => {
            gameEngineRef.current?.start();
            setIsGameLoaded(true);
        }, 2000);

        // Game loop
        let lastTime = performance.now();
        const gameLoop = (currentTime: number) => {
            const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
            lastTime = currentTime;

            if (gameEngineRef.current && isGameLoaded) {
                gameEngineRef.current.update(deltaTime);
            }

            requestAnimationFrame(gameLoop);
        };
        requestAnimationFrame(gameLoop);

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
    }, [navigate, isGameLoaded]);

    return (
        <div className="game-container w-full h-full">
            {/* The game canvas will be automatically added here by Three.js */}
            {gameEngineRef.current && (
                <HUD 
                    stats={gameEngineRef.current.getPlayer().getStats()} 
                    isGameLoaded={isGameLoaded}
                />
            )}
        </div>
    );
}; 