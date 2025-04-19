import React, { useEffect, useState } from 'react';

interface EventLogProps {
    events: string[];
}

export const EventLog: React.FC<EventLogProps> = ({ events }) => {
    return (
        <div className="absolute bottom-4 right-4 w-64 bg-black bg-opacity-50 p-4 rounded-lg text-white font-mono text-sm overflow-y-auto max-h-96">
            <h3 className="text-lg font-bold mb-2 text-yellow-400">Event Log</h3>
            <div className="space-y-1">
                {events.map((event, index) => (
                    <div 
                        key={index} 
                        className="border-l-2 border-yellow-400 pl-2 py-1 animate-fade-in"
                    >
                        {event}
                    </div>
                ))}
            </div>
        </div>
    );
}; 