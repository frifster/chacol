export class RoomTemplate {
    public type: string;
    public width: number;
    public height: number;
    public enemySpawnPoints: number;
    public itemSpawnPoints: number;
    public difficulty: number;

    constructor(
        type: string,
        width: number,
        height: number,
        enemySpawnPoints: number = 3,
        itemSpawnPoints: number = 2,
        difficulty: number = 1
    ) {
        this.type = type;
        this.width = width;
        this.height = height;
        this.enemySpawnPoints = enemySpawnPoints;
        this.itemSpawnPoints = itemSpawnPoints;
        this.difficulty = difficulty;
    }

    public getSpawnPoints(): {
        enemies: { x: number; z: number }[];
        items: { x: number; z: number }[];
    } {
        const enemyPoints = [];
        const itemPoints = [];

        // Generate random spawn points within the room
        for (let i = 0; i < this.enemySpawnPoints; i++) {
            enemyPoints.push({
                x: Math.random() * this.width,
                z: Math.random() * this.height
            });
        }

        for (let i = 0; i < this.itemSpawnPoints; i++) {
            itemPoints.push({
                x: Math.random() * this.width,
                z: Math.random() * this.height
            });
        }

        return {
            enemies: enemyPoints,
            items: itemPoints
        };
    }
} 