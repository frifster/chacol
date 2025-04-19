import { PlayerInput } from './Player';

export class InputManager {
    private keys: Set<string> = new Set();
    private mousePosition: { x: number; y: number } = { x: 0, y: 0 };
    private mouseDelta: { x: number; y: number } = { x: 0, y: 0 };
    private isPointerLocked: boolean = false;

    constructor() {
        // Keyboard events
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));

        // Mouse events
        window.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('pointerlockchange', this.handlePointerLockChange.bind(this));
    }

    private handleKeyDown(event: KeyboardEvent): void {
        this.keys.add(event.key.toLowerCase());
    }

    private handleKeyUp(event: KeyboardEvent): void {
        this.keys.delete(event.key.toLowerCase());
    }

    private handleMouseMove(event: MouseEvent): void {
        if (this.isPointerLocked) {
            this.mouseDelta.x = event.movementX;
            this.mouseDelta.y = event.movementY;
        }
        this.mousePosition.x = event.clientX;
        this.mousePosition.y = event.clientY;
    }

    private handlePointerLockChange(): void {
        this.isPointerLocked = document.pointerLockElement !== null;
    }

    public requestPointerLock(): void {
        document.body.requestPointerLock();
    }

    public exitPointerLock(): void {
        document.exitPointerLock();
    }

    public getPlayerInput(): PlayerInput {
        return {
            left: this.keys.has('a'),
            right: this.keys.has('d'),
            jump: this.keys.has(' ')
        };
    }

    public getMouseDelta(): { x: number; y: number } {
        const delta = { ...this.mouseDelta };
        this.mouseDelta = { x: 0, y: 0 }; // Reset delta
        return delta;
    }

    public getMousePosition(): { x: number; y: number } {
        return this.mousePosition;
    }

    public isKeyPressed(key: string): boolean {
        return this.keys.has(key.toLowerCase());
    }
} 