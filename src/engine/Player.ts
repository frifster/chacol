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
    private moveSpeed: number = 10;
    private jumpForce: number = 5;
    private isGrounded: boolean = false;
    private moveForce: number = 100;
    private hasDoubleJump: boolean = false;
    private doubleJumpCooldown: number = 0;
    private doubleJumpCooldownDuration: number = 0.2;
    private jumpPressed: boolean = false; // Track if jump button is currently pressed

    constructor(
        scene: THREE.Scene,
        physicsManager: PhysicsManager,
        position: THREE.Vector3 = new THREE.Vector3(0, 2, 0)
    ) {
        // Create player mesh with emissive material for better visibility
        const geometry = new THREE.BoxGeometry(1, 2, 1);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x00ff00,
            emissive: 0x003300,
            emissiveIntensity: 0.5,
            metalness: 0.5,
            roughness: 0.5
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        scene.add(this.mesh);

        // Create physics body
        const playerMaterial = new CANNON.Material('playerMaterial');
        playerMaterial.friction = 0.5;
        playerMaterial.restitution = 0.0;

        // Create physics body with the same dimensions as the mesh
        const shape = new CANNON.Box(new CANNON.Vec3(0.5, 1, 0.5)); // Half-dimensions
        this.body = new CANNON.Body({
            mass: 1,
            material: playerMaterial,
            shape: shape,
            position: new CANNON.Vec3(position.x, position.y, position.z),
            fixedRotation: true
        });

        // Set physics properties
        this.body.linearDamping = 0.5;
        this.body.angularDamping = 1.0;

        // Add body to physics world
        physicsManager.getWorld().addBody(this.body);

        // Add a point light to the player for better visibility
        const playerLight = new THREE.PointLight(0x00ff00, 1, 10);
        playerLight.position.set(0, 1, 0);
        this.mesh.add(playerLight);

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
            if (!this.mesh) return;
            
            ray.set(this.mesh.position, new THREE.Vector3(0, -1, 0));
            const intersects = ray.intersectObjects(this.mesh.parent?.children || []);
            this.isGrounded = intersects.length > 0 && intersects[0].distance < 1.1;
        };

        // Check for ground every frame
        setInterval(groundCheck, 16); // Approximately 60 times per second
    }

    public update(deltaTime: number, input: PlayerInput): void {
        if (!this.body || !this.mesh) {
            console.error('Player body or mesh not initialized');
            return;
        }

        // Update double jump cooldown
        if (this.doubleJumpCooldown > 0) {
            this.doubleJumpCooldown -= deltaTime;
        }

        // Reset double jump when grounded
        if (this.isGrounded) {
            this.hasDoubleJump = true;
        }

        // Handle jumping
        if (input.jump && !this.jumpPressed) {
            this.jumpPressed = true;
            if (this.isGrounded) {
                // Regular jump
                const jumpForce = new CANNON.Vec3(0, this.jumpForce * 25, 0);
                this.body.applyImpulse(jumpForce, this.body.position);
                this.isGrounded = false;
            } else if (this.hasDoubleJump && this.doubleJumpCooldown <= 0) {
                // Double jump
                const jumpForce = new CANNON.Vec3(0, this.jumpForce * 20, 0);
                this.body.applyImpulse(jumpForce, this.body.position);
                this.hasDoubleJump = false;
                this.doubleJumpCooldown = this.doubleJumpCooldownDuration;
            }
        } else if (!input.jump) {
            this.jumpPressed = false;
        }

        // Handle movement relative to player's rotation
        const moveDirection = new THREE.Vector3();
        
        if (input.left) moveDirection.x -= 1;
        if (input.right) moveDirection.x += 1;

        if (moveDirection.length() > 0) {
            moveDirection.normalize();
            
            // Apply direct velocity for more responsive movement
            this.body.velocity.x = moveDirection.x * this.moveSpeed;

            // Apply additional force for acceleration
            const force = new CANNON.Vec3(
                moveDirection.x * this.moveForce,
                0,
                0
            );

            this.body.applyForce(force, this.body.position);
        } else {
            // Apply friction when not moving
            this.body.velocity.x *= 0.8;
        }

        // Limit maximum vertical velocity
        if (Math.abs(this.body.velocity.y) > 10) {
            this.body.velocity.y = Math.sign(this.body.velocity.y) * 10;
        }

        // Sync mesh position with physics body
        this.mesh.position.copy(this.body.position as any);
        this.mesh.quaternion.copy(this.body.quaternion as any);
    }

    public getMesh(): THREE.Mesh {
        return this.mesh;
    }

    public getBody(): CANNON.Body {
        return this.body;
    }

    public resetState(): void {
        this.isGrounded = false;
        this.hasDoubleJump = false;
        this.doubleJumpCooldown = 0;
        this.jumpPressed = false;
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

    public updatePosition(position: THREE.Vector3): void {
        if (this.mesh && this.body) {
            this.mesh.position.copy(position);
            this.body.position.copy(position as any);
            this.body.quaternion.copy(this.mesh.quaternion as any);
        }
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
        if (!this.isGrounded) {
            const jumpForce = new CANNON.Vec3(0, this.jumpForce * 0.5, 0);
            this.body.applyImpulse(jumpForce, this.body.position);
            this.isGrounded = false;
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