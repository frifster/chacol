import React from 'react';
import { PlayerStats } from '../engine/PlayerStats';

interface HUDProps {
    stats: PlayerStats;
    isGameLoaded: boolean;
}

export const HUD: React.FC<HUDProps> = ({ stats, isGameLoaded }) => {
    if (!isGameLoaded) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="text-white text-2xl animate-pulse">Loading Game...</div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 pointer-events-none z-50">
            {/* Stats Bar */}
            <div className="absolute top-4 right-4 bg-black bg-opacity-50 p-4 rounded-lg">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-24 text-right">Health:</div>
                        <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-red-500 transition-all duration-300"
                                style={{ width: `${(stats.getHealth() / stats.getMaxHealth()) * 100}%` }}
                            />
                        </div>
                        <div className="w-16 text-right text-sm text-white">
                            {Math.floor(stats.getHealth())}/{stats.getMaxHealth()}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-700 rounded-full">
                            <div 
                                className="h-full bg-yellow-500 rounded-full transition-all duration-300"
                                style={{ width: `${stats.getStamina()}%` }}
                            />
                        </div>
                        <span className="text-white text-sm">Stamina</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-700 rounded-full">
                            <div 
                                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                                style={{ width: `${stats.getMana()}%` }}
                            />
                        </div>
                        <span className="text-white text-sm">Mana</span>
                    </div>
                </div>
            </div>

            {/* Controls Help */}
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 p-4 rounded-lg">
                <div className="text-white text-sm">
                    <div className="font-bold mb-2">Controls:</div>
                    <div>WASD - Move</div>
                    <div>Space - Jump</div>
                    <div>ESC - Exit</div>
                </div>
            </div>
        </div>
    );
}; 