import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameEngine } from '../engine/GameEngine';
import { EventLog } from './EventLog';
import { HUD } from './HUD';

export const Game: React.FC = () => {
    const gameEngineRef = useRef<GameEngine | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [isGameLoaded, setIsGameLoaded] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [events, setEvents] = useState<string[]>([]);
    const [gameState, setGameState] = useState<'playing' | 'over' | 'reset'>('playing');

    const addEvent = (event: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setEvents(prev => [`[${timestamp}] ${event}`, ...prev].slice(0, 50)); // Keep last 50 events
    };

    useEffect(() => {
        if (!containerRef.current) return;

        // Initialize game engine
        gameEngineRef.current = new GameEngine(containerRef.current);
        
        // Set up game over callback
        gameEngineRef.current.setGameOverCallback(() => {
            console.log('Game over callback triggered');
            setIsGameOver(true);
            setGameState('over');
            addEvent('Game Over - Player fell into the abyss');
        });
        
        // Start the game engine
        gameEngineRef.current.start();
        setIsGameLoaded(true);
        addEvent('Game Started');

        // Handle ESC key to exit
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                navigate('/');
                addEvent('Game Exited');
            }
            if (event.key === 'r' && isGameOver) {
                gameEngineRef.current?.resetGame();
                setIsGameOver(false);
                setGameState('reset');
                setTimeout(() => setGameState('playing'), 0); // Force re-render
                addEvent('Game Restarted');
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Cleanup on unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            if (gameEngineRef.current) {
                gameEngineRef.current.cleanup();
                const container = containerRef.current;
                if (container) {
                    while (container.firstChild) {
                        container.removeChild(container.firstChild);
                    }
                }
            }
        };
    }, [navigate, isGameOver]);

    return (
        <div 
            ref={containerRef} 
            className="game-container w-full h-full relative"
        >
            {isGameLoaded && gameEngineRef.current && gameState !== 'over' && (
                <>
                    <HUD 
                        stats={gameEngineRef.current.getPlayer().getStats()} 
                        isGameLoaded={isGameLoaded}
                    />
                    <EventLog events={events} />
                </>
            )}
            {isGameOver && (
                <div 
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
                    style={{ pointerEvents: 'auto' }}
                >
                    <div className="text-center p-8 rounded-lg bg-gray-900 bg-opacity-90 border-2 border-red-600 transform scale-100 animate-fade-in">
                        <h2 className="text-6xl font-bold text-red-500 mb-6 animate-pulse">GAME OVER</h2>
                        <div className="space-y-4">
                            <p className="text-2xl text-white mb-2">You fell into the abyss...</p>
                            <div className="space-y-2">
                                <p className="text-xl text-gray-300">Press <span className="text-yellow-400 font-bold">R</span> to restart</p>
                                <p className="text-xl text-gray-300">Press <span className="text-yellow-400 font-bold">ESC</span> to exit</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}; 