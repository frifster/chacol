import { Vector3 } from 'three';

export class Room {
    public type: string;
    public position: Vector3;
    public width: number;
    public height: number;
    public connections: Room[] = [];
    public enemies: any[] = []; // Will be populated with enemy data
    public items: any[] = []; // Will be populated with item data

    constructor(
        type: string,
        position: Vector3,
        width: number,
        height: number
    ) {
        this.type = type;
        this.position = position;
        this.width = width;
        this.height = height;
    }

    public addConnection(room: Room): void {
        if (!this.connections.includes(room)) {
            this.connections.push(room);
        }
    }

    public isConnectedTo(room: Room): boolean {
        return this.connections.includes(room);
    }

    public getCenter(): Vector3 {
        return new Vector3(
            this.position.x + this.width / 2,
            this.position.y,
            this.position.z + this.height / 2
        );
    }

    public getBounds(): {
        minX: number;
        maxX: number;
        minZ: number;
        maxZ: number;
    } {
        return {
            minX: this.position.x,
            maxX: this.position.x + this.width,
            minZ: this.position.z,
            maxZ: this.position.z + this.height
        };
    }

    public getSpawnPoints(): {
        enemies: { x: number; z: number }[];
        items: { x: number; z: number }[];
    } {
        const enemyCount = this.getEnemyCount();
        const itemCount = this.getItemCount();

        const enemyPoints = [];
        const itemPoints = [];

        // Generate enemy spawn points
        for (let i = 0; i < enemyCount; i++) {
            enemyPoints.push({
                x: this.position.x + Math.random() * this.width,
                z: this.position.z + Math.random() * this.height
            });
        }

        // Generate item spawn points
        for (let i = 0; i < itemCount; i++) {
            itemPoints.push({
                x: this.position.x + Math.random() * this.width,
                z: this.position.z + Math.random() * this.height
            });
        }

        return {
            enemies: enemyPoints,
            items: itemPoints
        };
    }

    private getEnemyCount(): number {
        // Base enemy count based on room type
        switch (this.type) {
            case 'start':
                return 0;
            case 'normal':
                return Math.floor(Math.random() * 3) + 1; // 1-3 enemies
            case 'large':
                return Math.floor(Math.random() * 5) + 2; // 2-6 enemies
            case 'boss':
                return 1; // Just the boss
            default:
                return 0;
        }
    }

    private getItemCount(): number {
        // Base item count based on room type
        switch (this.type) {
            case 'start':
                return 1; // Starting items
            case 'normal':
                return Math.floor(Math.random() * 2) + 1; // 1-2 items
            case 'large':
                return Math.floor(Math.random() * 3) + 2; // 2-4 items
            case 'boss':
                return 2; // Boss rewards
            default:
                return 0;
        }
    }
} 