import { Vector3 } from 'three';
import { CorridorGenerator } from './CorridorGenerator';
import { Room } from './Room';
import { RoomTemplate } from './RoomTemplate';

export class DungeonGenerator {
    private rooms: Room[] = [];
    private roomTemplates: RoomTemplate[] = [];
    private corridorGenerator: CorridorGenerator;
    private maxRooms: number;
    private minRooms: number;
    private gridSize: number;
    private roomSize: number;

    constructor(
        maxRooms: number = 10,
        minRooms: number = 5,
        gridSize: number = 20,
        roomSize: number = 10,
        corridorWidth: number = 2
    ) {
        this.maxRooms = maxRooms;
        this.minRooms = minRooms;
        this.gridSize = gridSize;
        this.roomSize = roomSize;
        this.corridorGenerator = new CorridorGenerator(corridorWidth);
    }

    public generate(): {
        rooms: Room[];
        corridors: {
            start: Vector3;
            end: Vector3;
            width: number;
        }[];
    } {
        this.rooms = [];
        this.initializeRoomTemplates();
        this.generateStartingRoom();
        this.generateDungeon();
        this.corridorGenerator.generateCorridors(this.rooms);
        
        return {
            rooms: this.rooms,
            corridors: this.corridorGenerator.getCorridors()
        };
    }

    private initializeRoomTemplates(): void {
        // Basic room templates
        this.roomTemplates = [
            new RoomTemplate('start', 1, 1),
            new RoomTemplate('normal', 1, 1),
            new RoomTemplate('large', 2, 2),
            new RoomTemplate('boss', 3, 3)
        ];
    }

    private generateStartingRoom(): void {
        const startRoom = new Room(
            'start',
            new Vector3(0, 0, 0),
            this.roomSize,
            this.roomSize
        );
        this.rooms.push(startRoom);
    }

    private generateDungeon(): void {
        let currentRoom = this.rooms[0];
        let attempts = 0;
        const maxAttempts = 100;

        while (this.rooms.length < this.maxRooms && attempts < maxAttempts) {
            const template = this.getRandomTemplate();
            const direction = this.getRandomDirection();
            const position = this.calculateNewPosition(currentRoom, direction, template);

            if (this.isValidPosition(position, template)) {
                const newRoom = new Room(
                    template.type,
                    position,
                    template.width * this.roomSize,
                    template.height * this.roomSize
                );
                this.rooms.push(newRoom);
                currentRoom = newRoom;
            }
            attempts++;
        }
    }

    private connectRooms(): void {
        // This method is now handled by the CorridorGenerator
    }

    private getRandomTemplate(): RoomTemplate {
        const index = Math.floor(Math.random() * this.roomTemplates.length);
        return this.roomTemplates[index];
    }

    private getRandomDirection(): Vector3 {
        const directions = [
            new Vector3(1, 0, 0),
            new Vector3(-1, 0, 0),
            new Vector3(0, 0, 1),
            new Vector3(0, 0, -1)
        ];
        return directions[Math.floor(Math.random() * directions.length)];
    }

    private calculateNewPosition(currentRoom: Room, direction: Vector3, template: RoomTemplate): Vector3 {
        return new Vector3(
            currentRoom.position.x + direction.x * (currentRoom.width + template.width * this.roomSize),
            currentRoom.position.y,
            currentRoom.position.z + direction.z * (currentRoom.height + template.height * this.roomSize)
        );
    }

    private isValidPosition(position: Vector3, template: RoomTemplate): boolean {
        // Check if the new room would overlap with existing rooms
        for (const room of this.rooms) {
            if (this.checkOverlap(position, template, room)) {
                return false;
            }
        }
        return true;
    }

    private checkOverlap(position: Vector3, template: RoomTemplate, existingRoom: Room): boolean {
        const newRoomWidth = template.width * this.roomSize;
        const newRoomHeight = template.height * this.roomSize;

        return !(
            position.x + newRoomWidth < existingRoom.position.x ||
            position.x > existingRoom.position.x + existingRoom.width ||
            position.z + newRoomHeight < existingRoom.position.z ||
            position.z > existingRoom.position.z + existingRoom.height
        );
    }
} 