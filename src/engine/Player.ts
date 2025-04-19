import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { PhysicsManager } from './PhysicsManager';
import { PlayerStats } from './PlayerStats';

export class Player {
    private mesh: THREE.Mesh;
    private body: CANNON.Body;
    private stats: PlayerStats;
    private inventory: Inventory;
    private equipment: Equipment;
    private moveSpeed: number = 5;
    private jumpForce: number = 5;
    private isGrounded: boolean = false;
    private isJumping: boolean = false;
    private moveForce: number = 10;
    private initialJumpY: number = 0;
    private maxJumpHeight: number = 5;

    constructor(
        scene: THREE.Scene,
        physicsManager: PhysicsManager,
        position: THREE.Vector3 = new THREE.Vector3(0, 2, 0)
    ) {
        // Create player mesh
        const geometry = new THREE.BoxGeometry(1, 2, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);
        scene.add(this.mesh);

        // Create physics body
        const playerMaterial = new CANNON.Material('playerMaterial');
        playerMaterial.friction = 0.3;
        playerMaterial.restitution = 0.2;

        this.body = physicsManager.createBox(this.mesh, 1, playerMaterial);
        this.body.linearDamping = 0.3;
        this.body.angularDamping = 0.3;
        this.body.fixedRotation = true;

        // Initialize stats
        this.stats = new PlayerStats();

        // Initialize inventory and equipment
        this.inventory = new Inventory();
        this.equipment = new Equipment();

        // Set up ground check
        this.setupGroundCheck();
    }

    private setupGroundCheck(): void {
        const ray = new THREE.Raycaster();
        const groundCheck = () => {
            ray.set(this.mesh.position, new THREE.Vector3(0, -1, 0));
            const intersects = ray.intersectObjects(this.mesh.parent?.children || []);
            this.isGrounded = intersects.length > 0 && intersects[0].distance < 1.1;
            if (this.isGrounded) {
                this.initialJumpY = this.mesh.position.y;
            }
        };

        // Check for ground every frame
        setInterval(groundCheck, 100);
    }

    public update(deltaTime: number, input: PlayerInput): void {
        // Handle movement (2D only - left/right)
        const moveDirection = new THREE.Vector3();
        
        if (input.left) moveDirection.x -= 1;
        if (input.right) moveDirection.x += 1;

        if (moveDirection.length() > 0) {
            moveDirection.normalize();
            
            // Calculate target velocity (2D only)
            const targetVelocity = new CANNON.Vec3(
                moveDirection.x * this.moveSpeed,
                0, // Keep vertical velocity at 0 during movement
                0  // No Z-axis movement
            );

            // Calculate force needed to reach target velocity
            const currentVelocity = this.body.velocity;
            const force = new CANNON.Vec3(
                (targetVelocity.x - currentVelocity.x) * this.moveForce,
                0, // No vertical force during movement
                0  // No Z-axis force
            );

            // Apply force
            this.body.applyForce(force, this.body.position);

            // Maintain constant height during movement
            if (!this.isJumping) {
                const currentPosition = this.body.position;
                this.body.position.set(
                    currentPosition.x,
                    this.initialJumpY, // Keep at initial height
                    0  // Keep Z position at 0
                );
                this.body.velocity.y = 0; // Reset vertical velocity
            }
        }

        // Handle jumping
        if (input.jump && this.isGrounded) {
            const jumpForce = new CANNON.Vec3(0, this.jumpForce * 0.5, 0);
            this.body.applyImpulse(jumpForce, this.body.position);
            this.isGrounded = false;
            this.initialJumpY = this.mesh.position.y;
        }

        // Limit jump height
        if (this.isJumping && !this.isGrounded) {
            const currentHeight = this.mesh.position.y - this.initialJumpY;
            if (currentHeight >= this.maxJumpHeight) {
                // Apply downward force to limit height
                const downwardForce = new CANNON.Vec3(0, -this.jumpForce * 20, 0);
                this.body.applyForce(downwardForce, this.body.position);
            }
        }

        // Update stats
        this.stats.update(deltaTime);

        // Update player state
        if (this.mesh.position.y < 0.5) {
            this.isJumping = false;
            this.isGrounded = true;
            this.initialJumpY = 0.5; // Reset to ground level
        }

        // Sync mesh position with physics body (2D only)
        this.mesh.position.set(
            this.body.position.x,
            this.body.position.y,
            0  // Keep Z position at 0
        );
        this.mesh.quaternion.copy(this.body.quaternion as any);
    }

    public getMesh(): THREE.Mesh {
        return this.mesh;
    }

    public getStats(): PlayerStats {
        return this.stats;
    }

    public getInventory(): Inventory {
        return this.inventory;
    }

    public getEquipment(): Equipment {
        return this.equipment;
    }

    public updatePosition(position: THREE.Vector3) {
        this.mesh.position.set(position.x, position.y, 0);
    }

    public move(direction: THREE.Vector3, deltaTime: number) {
        const moveAmount = new THREE.Vector3(
            direction.x * this.moveSpeed * deltaTime,
            0,
            0
        );
        this.mesh.position.add(moveAmount);
    }

    public jump() {
        if (!this.isJumping) {
            this.isJumping = true;
            const jumpForce = new CANNON.Vec3(0, this.jumpForce * 0.5, 0);
            this.body.applyImpulse(jumpForce, this.body.position);
            this.initialJumpY = this.mesh.position.y;
        }
    }
}

export class Inventory {
    private items: Map<string, number> = new Map();
    private maxSize: number = 20;

    public addItem(itemId: string, quantity: number = 1): boolean {
        const currentQuantity = this.items.get(itemId) || 0;
        if (this.items.size >= this.maxSize && !this.items.has(itemId)) {
            return false;
        }
        this.items.set(itemId, currentQuantity + quantity);
        return true;
    }

    public removeItem(itemId: string, quantity: number = 1): boolean {
        const currentQuantity = this.items.get(itemId) || 0;
        if (currentQuantity < quantity) {
            return false;
        }
        this.items.set(itemId, currentQuantity - quantity);
        if (currentQuantity - quantity === 0) {
            this.items.delete(itemId);
        }
        return true;
    }

    public getItems(): Map<string, number> {
        return this.items;
    }
}

export class Equipment {
    private slots: Map<string, string | null> = new Map([
        ['head', null],
        ['chest', null],
        ['legs', null],
        ['feet', null],
        ['weapon', null],
        ['shield', null],
        ['ring1', null],
        ['ring2', null],
        ['amulet', null]
    ]);

    public equip(itemId: string, slot: string): boolean {
        if (this.slots.has(slot)) {
            this.slots.set(slot, itemId);
            return true;
        }
        return false;
    }

    public unequip(slot: string): string | null {
        const item = this.slots.get(slot) || null;
        this.slots.set(slot, null);
        return item;
    }

    public getEquippedItems(): Map<string, string | null> {
        return this.slots;
    }
}

export interface PlayerInput {
    left: boolean;
    right: boolean;
    jump: boolean;
} 