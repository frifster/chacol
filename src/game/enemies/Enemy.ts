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
        const geometry = new THREE.BoxGeometry(1, 2, 1); // Changed depth to 1 to match player
        const material = new THREE.MeshStandardMaterial({ 
            color: this.getColorForType(type),
            emissive: this.getColorForType(type),
            emissiveIntensity: 0.3,
            metalness: 0.5,
            roughness: 0.5
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);
        this.mesh.position.z = 0; // Ensure enemy is on same Z-plane as player
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        scene.add(this.mesh);

        // Create physics body with adjusted dimensions
        const enemyMaterial = physicsManager.getMaterial('world');
        const shape = new CANNON.Box(new CANNON.Vec3(0.5, 1, 0.5)); // Changed depth to match player
        this.body = new CANNON.Body({
            mass: 0,
            material: enemyMaterial,
            shape: shape,
            position: new CANNON.Vec3(position.x, position.y, 0), // Ensure Z is 0
            fixedRotation: true,
            type: CANNON.Body.STATIC,
            collisionFilterGroup: COLLISION_GROUPS.ENEMY,
            collisionFilterMask: COLLISION_GROUPS.PLAYER
        });

        // Set up collision event handling
        this.body.addEventListener('collide', (event: any) => {
            console.log('Enemy collision detected');
            const otherBody = event.contact.bj === this.body ? event.contact.bi : event.contact.bj;
            console.log('Other body group:', otherBody.collisionFilterGroup);
            if (otherBody.collisionFilterGroup === COLLISION_GROUPS.PLAYER) {
                console.log('Player collision confirmed');
                const player = (otherBody as any).userData?.player;
                if (player) {
                    console.log('Player reference found, applying damage');
                    this.handlePlayerCollision(player);
                }
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
                    damage: 20,
                    speed: 2
                };
            case 'large':
                return {
                    health: 100,
                    maxHealth: 100,
                    damage: 35,
                    speed: 1
                };
            case 'boss':
                return {
                    health: 200,
                    maxHealth: 200,
                    damage: 50,
                    speed: 1.5
                };
            default:
                return {
                    health: 50,
                    maxHealth: 50,
                    damage: 20,
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
        // Simple patrol movement
        const currentX = this.body.position.x;
        const distanceFromStart = Math.abs(currentX - this.startX);

        // Change direction if moved too far from start position
        if (distanceFromStart >= this.moveDistance) {
            this.moveDirection *= -1;
        }

        // Calculate new position
        const newX = currentX + (this.moveDirection * this.stats.speed * deltaTime);
        
        // Update both body and mesh positions
        this.body.position.x = newX;
        this.body.position.y = 0.5; // Keep it at floor level
        this.body.position.z = 0; // Ensure Z stays at 0
        this.mesh.position.copy(this.body.position as unknown as THREE.Vector3);
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
        const currentHealth = playerStats.getHealth();
        playerStats.takeDamage(this.stats.damage);
        const newHealth = playerStats.getHealth();
        
        console.log('Player Health: Before =', currentHealth, 'After =', newHealth, 'Damage =', this.stats.damage);
        
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
        if (newHealth <= 0) {
            console.log('Player died! Health reached 0');
            player.die();
        }
    }
} 