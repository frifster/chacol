import * as THREE from 'three';
import { Vector3 } from 'three';
import { PhysicsManager } from '../../engine/PhysicsManager';
import { Enemy } from '../enemies/Enemy';
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
    private enemies: Enemy[] = [];
    private scene: THREE.Scene;
    private physicsManager: PhysicsManager;

    constructor(
        scene: THREE.Scene,
        physicsManager: PhysicsManager,
        maxRooms: number = 10,
        minRooms: number = 5,
        gridSize: number = 20,
        roomSize: number = 10,
        corridorWidth: number = 2
    ) {
        this.scene = scene;
        this.physicsManager = physicsManager;
        this.generator = new DungeonGenerator(
            maxRooms,
            minRooms,
            gridSize,
            roomSize,
            corridorWidth
        );
    }

    public generateNewDungeon(): void {
        // Clear existing enemies
        this.clearEnemies();
        
        // Generate new dungeon
        this.currentDungeon = this.generator.generate();
        this.placeEnemies();
        this.placeItems();
    }

    private clearEnemies(): void {
        this.enemies.forEach(enemy => {
            // The die() method will handle cleanup
            enemy.takeDamage(Infinity);
        });
        this.enemies = [];
    }

    private placeEnemies(): void {
        if (!this.currentDungeon) return;

        for (const room of this.currentDungeon.rooms) {
            if (room.type === 'start') continue; // Skip enemy placement in start room

            const spawnPoints = room.getSpawnPoints();
            const enemyCount = this.calculateEnemyCount(room);
            const enemyTypes = this.getEnemyTypesForRoom(room);

            for (let i = 0; i < enemyCount; i++) {
                if (spawnPoints.enemies.length === 0) break;

                const spawnPoint = spawnPoints.enemies[Math.floor(Math.random() * spawnPoints.enemies.length)];
                const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
                
                const enemy = new Enemy(
                    this.scene,
                    this.physicsManager,
                    new Vector3(spawnPoint.x, 0.5, spawnPoint.z),
                    enemyType
                );
                
                this.enemies.push(enemy);
            }
        }
    }

    private calculateEnemyCount(room: Room): number {
        // Base enemy count on room type and size
        let baseCount = 2;
        
        if (room.type === 'boss') {
            baseCount = 1; // Boss room has fewer but stronger enemies
        } else if (room.type === 'treasure') {
            baseCount = 3; // Treasure rooms have more enemies
        }

        // Adjust based on room size
        const roomSize = room.getBounds();
        const area = (roomSize.maxX - roomSize.minX) * (roomSize.maxZ - roomSize.minZ);
        return Math.floor(baseCount * (area / 100)); // Scale with room area
    }

    private getEnemyTypesForRoom(room: Room): string[] {
        switch (room.type) {
            case 'boss':
                return ['boss'];
            case 'treasure':
                return ['normal', 'large'];
            default:
                return ['normal'];
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

    public update(deltaTime: number): void {
        // Update all enemies
        this.enemies.forEach(enemy => {
            enemy.update(deltaTime);
        });
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

    public getEnemies(): Enemy[] {
        return this.enemies;
    }
} 