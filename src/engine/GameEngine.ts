import * as THREE from 'three';
import { PhysicsManager } from './PhysicsManager';
import { SceneManager } from './SceneManager';

export class GameEngine {
    private sceneManager: SceneManager;
    private physicsManager: PhysicsManager;
    private isRunning: boolean = false;

    constructor() {
        this.sceneManager = new SceneManager();
        this.physicsManager = new PhysicsManager(this.sceneManager.getWorld());
    }

    public start(): void {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.sceneManager.start();
        
        // Add some basic lighting
        const ambientLight = new THREE.AmbientLight(0x404040);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        
        this.sceneManager.add(ambientLight);
        this.sceneManager.add(directionalLight);

        // Create a ground plane
        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -1;
        
        this.sceneManager.add(ground);
        this.physicsManager.createBox(ground, 0);

        // Create a test box
        const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
        const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.position.set(0, 5, 0);
        
        this.sceneManager.add(box);
        this.physicsManager.createBox(box, 1);
    }

    public stop(): void {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        this.sceneManager.stop();
    }

    public getSceneManager(): SceneManager {
        return this.sceneManager;
    }

    public getPhysicsManager(): PhysicsManager {
        return this.physicsManager;
    }
} 