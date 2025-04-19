import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { PhysicsManager } from '../../engine/PhysicsManager';

export class Enemy {
    private mesh: THREE.Mesh;
    private body: CANNON.Body;
    private stats: {
        health: number;
        maxHealth: number;
        damage: number;
        speed: number;
    };
    private type: string;
    private scene: THREE.Scene;
    private moveDirection: number = 1; // 1 for right, -1 for left
    private moveDistance: number = 5; // How far the enemy moves before changing direction
    private startX: number;

    constructor(
        scene: THREE.Scene,
        physicsManager: PhysicsManager,
        position: THREE.Vector3,
        type: string = 'normal'
    ) {
        this.scene = scene;
        this.type = type;
        this.startX = position.x;
        
        // Initialize stats based on enemy type
        this.stats = this.getStatsForType(type);

        // Create enemy mesh with adjusted dimensions for 2D side view
        const geometry = new THREE.BoxGeometry(1, 2, 0.1);
        const material = new THREE.MeshStandardMaterial({ 
            color: this.getColorForType(type),
            emissive: this.getColorForType(type),
            emissiveIntensity: 0.3,
            metalness: 0.5,
            roughness: 0.5
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        scene.add(this.mesh);

        // Create physics body with adjusted dimensions
        const enemyMaterial = new CANNON.Material('enemyMaterial');
        enemyMaterial.friction = 0.5;
        enemyMaterial.restitution = 0.0;

        const shape = new CANNON.Box(new CANNON.Vec3(0.5, 1, 0.05));
        this.body = new CANNON.Body({
            mass: 0, // Set mass to 0 to prevent falling
            material: enemyMaterial,
            shape: shape,
            position: new CANNON.Vec3(position.x, position.y, position.z),
            fixedRotation: true,
            type: CANNON.Body.KINEMATIC // Make it kinematic to prevent physics from affecting it
        });

        // Set physics properties
        this.body.linearDamping = 0.5;
        this.body.angularDamping = 1.0;

        // Add body to physics world
        physicsManager.getWorld().addBody(this.body);

        // Add a point light to the enemy for better visibility
        const enemyLight = new THREE.PointLight(this.getColorForType(type), 1, 10);
        enemyLight.position.set(0, 0.5, 0);
        this.mesh.add(enemyLight);
    }

    private getStatsForType(type: string): {
        health: number;
        maxHealth: number;
        damage: number;
        speed: number;
    } {
        switch (type) {
            case 'normal':
                return {
                    health: 50,
                    maxHealth: 50,
                    damage: 10,
                    speed: 8
                };
            case 'large':
                return {
                    health: 100,
                    maxHealth: 100,
                    damage: 20,
                    speed: 5
                };
            case 'boss':
                return {
                    health: 200,
                    maxHealth: 200,
                    damage: 30,
                    speed: 6
                };
            default:
                return {
                    health: 50,
                    maxHealth: 50,
                    damage: 10,
                    speed: 8
                };
        }
    }

    private getColorForType(type: string): number {
        switch (type) {
            case 'normal':
                return 0xff0000;
            case 'large':
                return 0x990000;
            case 'boss':
                return 0x660000;
            default:
                return 0xff0000;
        }
    }

    public update(deltaTime: number): void {
        // Update enemy position based on physics
        this.mesh.position.copy(this.body.position as unknown as THREE.Vector3);
        this.mesh.quaternion.copy(this.body.quaternion as unknown as THREE.Quaternion);

        // Simple patrol movement
        const currentX = this.body.position.x;
        const distanceFromStart = Math.abs(currentX - this.startX);

        // Change direction if moved too far from start position
        if (distanceFromStart >= this.moveDistance) {
            this.moveDirection *= -1;
        }

        // Apply movement directly to position since it's kinematic
        const newX = currentX + (this.moveDirection * this.stats.speed * deltaTime);
        this.body.position.x = newX;
        this.body.position.y = 0.5; // Keep it at floor level
    }

    public takeDamage(amount: number): void {
        this.stats.health = Math.max(0, this.stats.health - amount);
        if (this.stats.health <= 0) {
            this.die();
        }
    }

    private die(): void {
        // Remove from scene and physics world
        this.scene.remove(this.mesh);
        this.body.world?.removeBody(this.body);
    }

    public getPosition(): THREE.Vector3 {
        return this.mesh.position;
    }

    public getStats() {
        return this.stats;
    }
} 