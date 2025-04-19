import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameEngine } from '../engine/GameEngine';
import { HUD } from './HUD';

export const Game: React.FC = () => {
    const gameEngineRef = useRef<GameEngine | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [isGameLoaded, setIsGameLoaded] = useState(false);

    useEffect(() => {
        if (!containerRef.current) return;

        // Initialize game engine
        gameEngineRef.current = new GameEngine(containerRef.current);
        
        // Start the game engine
        gameEngineRef.current.start();
        setIsGameLoaded(true);

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
                // Clean up game engine resources
                gameEngineRef.current.cleanup();
                
                // Clean up Three.js resources
                const container = containerRef.current;
                if (container) {
                    while (container.firstChild) {
                        container.removeChild(container.firstChild);
                    }
                }
            }
        };
    }, [navigate]);

    return (
        <div 
            ref={containerRef} 
            className="game-container w-full h-full relative"
        >
            {isGameLoaded && gameEngineRef.current && (
                <HUD 
                    stats={gameEngineRef.current.getPlayer().getStats()} 
                    isGameLoaded={isGameLoaded}
                />
            )}
        </div>
    );
}; 