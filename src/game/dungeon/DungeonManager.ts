import { Vector3 } from 'three';
import { DungeonGenerator } from './DungeonGenerator';
import { Room } from './Room';

export class DungeonManager {
    private generator: DungeonGenerator;
    private currentDungeon: {
        rooms: Room[];
        corridors: {
            start: Vector3;
            end: Vector3;
            width: number;
        }[];
    } | null = null;

    constructor(
        maxRooms: number = 10,
        minRooms: number = 5,
        gridSize: number = 20,
        roomSize: number = 10,
        corridorWidth: number = 2
    ) {
        this.generator = new DungeonGenerator(
            maxRooms,
            minRooms,
            gridSize,
            roomSize,
            corridorWidth
        );
    }

    public generateNewDungeon(): void {
        this.currentDungeon = this.generator.generate();
        this.placeEnemies();
        this.placeItems();
    }

    private placeEnemies(): void {
        if (!this.currentDungeon) return;

        for (const room of this.currentDungeon.rooms) {
            if (room.type === 'start') continue; // Skip enemy placement in start room

            const spawnPoints = room.getSpawnPoints();
            // TODO: Implement enemy placement logic
            // This will be implemented when we have the enemy system ready
        }
    }

    private placeItems(): void {
        if (!this.currentDungeon) return;

        for (const room of this.currentDungeon.rooms) {
            const spawnPoints = room.getSpawnPoints();
            // TODO: Implement item placement logic
            // This will be implemented when we have the item system ready
        }
    }

    public getCurrentDungeon(): typeof this.currentDungeon {
        return this.currentDungeon;
    }

    public getRoomAtPosition(position: Vector3): Room | null {
        if (!this.currentDungeon) return null;

        for (const room of this.currentDungeon.rooms) {
            const bounds = room.getBounds();
            if (
                position.x >= bounds.minX &&
                position.x <= bounds.maxX &&
                position.z >= bounds.minZ &&
                position.z <= bounds.maxZ
            ) {
                return room;
            }
        }
        return null;
    }
} 