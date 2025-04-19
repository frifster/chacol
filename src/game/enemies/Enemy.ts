import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { PhysicsManager } from '../../engine/PhysicsManager';
import { Player } from '../../engine/Player';

// Define collision groups (matching Player.ts and GameEngine.ts)
const COLLISION_GROUPS = {
    WORLD: 1,
    ENEMY: 2,
    PLAYER: 4
};

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
    private lastPlayerCollisionTime: number = 0;
    private damageInterval: number = 1; // Time in seconds between damage applications

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
            mass: 0,
            material: enemyMaterial,
            shape: shape,
            position: new CANNON.Vec3(position.x, position.y, position.z),
            fixedRotation: true,
            type: CANNON.Body.KINEMATIC,
            collisionFilterGroup: COLLISION_GROUPS.ENEMY,
            collisionFilterMask: COLLISION_GROUPS.PLAYER
        });

        // Set physics properties
        this.body.linearDamping = 0.5;
        this.body.angularDamping = 1.0;

        // Add collision event listener
        this.body.addEventListener('collide', (event: any) => {
            const otherBody = event.body;
            if (otherBody.collisionFilterGroup === COLLISION_GROUPS.PLAYER) {
                this.handlePlayerCollision(otherBody.userData?.player);
            }
        });

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
                    speed: 2
                };
            case 'large':
                return {
                    health: 100,
                    maxHealth: 100,
                    damage: 20,
                    speed: 1
                };
            case 'boss':
                return {
                    health: 200,
                    maxHealth: 200,
                    damage: 30,
                    speed: 1.5
                };
            default:
                return {
                    health: 50,
                    maxHealth: 50,
                    damage: 10,
                    speed: 2
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

    private handlePlayerCollision(player: Player): void {
        if (!player) return;

        const currentTime = performance.now() / 1000; // Convert to seconds
        if (currentTime - this.lastPlayerCollisionTime < this.damageInterval) {
            return; // Don't apply damage if not enough time has passed
        }

        // Apply damage to player
        const playerStats = player.getStats();
        playerStats.takeDamage(this.stats.damage);
        this.lastPlayerCollisionTime = currentTime;

        // Apply knockback to player
        const playerBody = player.getBody();
        if (playerBody) {
            const knockbackForce = 5;
            const direction = Math.sign(playerBody.position.x - this.body.position.x);
            playerBody.velocity.x = direction * knockbackForce;
            playerBody.velocity.y = knockbackForce / 2; // Small upward boost
        }

        // Check for player death
        if (playerStats.getHealth() <= 0) {
            // Trigger game over through the player
            player.die();
        }
    }
} 