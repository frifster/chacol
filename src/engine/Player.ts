import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { PhysicsManager } from './PhysicsManager';

export class Player {
    private mesh: THREE.Mesh;
    private body: CANNON.Body;
    private stats: PlayerStats;
    private inventory: Inventory;
    private equipment: Equipment;
    private moveSpeed: number = 5;
    private jumpForce: number = 5;
    private isGrounded: boolean = false;

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
        this.body = physicsManager.createBox(this.mesh, 1);
        this.body.linearDamping = 0.9;
        this.body.angularDamping = 0.9;

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
        };

        // Check for ground every frame
        setInterval(groundCheck, 100);
    }

    public update(deltaTime: number, input: PlayerInput): void {
        // Handle movement
        const moveDirection = new THREE.Vector3();
        
        if (input.forward) moveDirection.z -= 1;
        if (input.backward) moveDirection.z += 1;
        if (input.left) moveDirection.x -= 1;
        if (input.right) moveDirection.x += 1;

        moveDirection.normalize();
        moveDirection.multiplyScalar(this.moveSpeed * deltaTime);

        // Apply movement to physics body
        this.body.velocity.x = moveDirection.x;
        this.body.velocity.z = moveDirection.z;

        // Handle jumping
        if (input.jump && this.isGrounded) {
            this.body.velocity.y = this.jumpForce;
            this.isGrounded = false;
        }

        // Update stats
        this.stats.update(deltaTime);
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
}

export class PlayerStats {
    private health: number = 100;
    private maxHealth: number = 100;
    private stamina: number = 100;
    private maxStamina: number = 100;
    private mana: number = 100;
    private maxMana: number = 100;

    public update(deltaTime: number): void {
        // Regenerate stats over time
        this.stamina = Math.min(this.maxStamina, this.stamina + 10 * deltaTime);
        this.mana = Math.min(this.maxMana, this.mana + 5 * deltaTime);
    }

    public takeDamage(amount: number): void {
        this.health = Math.max(0, this.health - amount);
    }

    public useStamina(amount: number): boolean {
        if (this.stamina >= amount) {
            this.stamina -= amount;
            return true;
        }
        return false;
    }

    public useMana(amount: number): boolean {
        if (this.mana >= amount) {
            this.mana -= amount;
            return true;
        }
        return false;
    }

    public getHealth(): number {
        return this.health;
    }

    public getStamina(): number {
        return this.stamina;
    }

    public getMana(): number {
        return this.mana;
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
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    jump: boolean;
} 