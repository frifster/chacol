import { Vector3 } from 'three';
import { Room } from './Room';

export class CorridorGenerator {
    private corridors: {
        start: Vector3;
        end: Vector3;
        width: number;
    }[] = [];

    constructor(private corridorWidth: number = 2) {}

    public generateCorridors(rooms: Room[]): void {
        // Create a minimum spanning tree to ensure all rooms are connected
        const connectedRooms = new Set<Room>();
        const unconnectedRooms = new Set<Room>(rooms);
        
        // Start with the first room
        const startRoom = rooms[0];
        connectedRooms.add(startRoom);
        unconnectedRooms.delete(startRoom);

        while (unconnectedRooms.size > 0) {
            let closestRoom: Room | null = null;
            let closestDistance = Infinity;
            let closestConnectedRoom: Room | null = null;

            // Find the closest unconnected room to any connected room
            for (const connectedRoom of connectedRooms) {
                for (const unconnectedRoom of unconnectedRooms) {
                    const distance = this.calculateDistance(
                        connectedRoom.getCenter(),
                        unconnectedRoom.getCenter()
                    );

                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestRoom = unconnectedRoom;
                        closestConnectedRoom = connectedRoom;
                    }
                }
            }

            if (closestRoom && closestConnectedRoom) {
                // Create corridor between the rooms
                this.createCorridor(closestConnectedRoom, closestRoom);
                
                // Update connected rooms
                connectedRooms.add(closestRoom);
                unconnectedRooms.delete(closestRoom);
                
                // Add connection between rooms
                closestConnectedRoom.addConnection(closestRoom);
                closestRoom.addConnection(closestConnectedRoom);
            }
        }
    }

    private createCorridor(room1: Room, room2: Room): void {
        const start = room1.getCenter();
        const end = room2.getCenter();

        // Create a corridor with some variation
        const midPoint = new Vector3(
            (start.x + end.x) / 2,
            start.y,
            (start.z + end.z) / 2
        );

        // Add some randomness to the corridor path
        const variation = 2;
        midPoint.x += (Math.random() - 0.5) * variation;
        midPoint.z += (Math.random() - 0.5) * variation;

        // Create two segments for the corridor
        this.corridors.push({
            start: start,
            end: midPoint,
            width: this.corridorWidth
        });

        this.corridors.push({
            start: midPoint,
            end: end,
            width: this.corridorWidth
        });
    }

    private calculateDistance(point1: Vector3, point2: Vector3): number {
        return Math.sqrt(
            Math.pow(point2.x - point1.x, 2) +
            Math.pow(point2.z - point1.z, 2)
        );
    }

    public getCorridors(): typeof this.corridors {
        return this.corridors;
    }
} 