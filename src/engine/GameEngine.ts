import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { InputManager } from './InputManager';
import { PhysicsManager } from './PhysicsManager';
import { Player } from './Player';
import { SceneManager } from './SceneManager';

export class GameEngine {
    private sceneManager: SceneManager;
    private physicsManager: PhysicsManager;
    private player: Player;
    private inputManager: InputManager;
    private isRunning: boolean = false;

    constructor() {
        this.sceneManager = new SceneManager();
        this.physicsManager = this.sceneManager.getPhysicsManager();
        this.inputManager = new InputManager();
        
        // Create player
        this.player = new Player(
            this.sceneManager.getScene(),
            this.physicsManager
        );

        // Set up camera to follow player
        const camera = this.sceneManager.getCamera();
        camera.position.set(0, 5, 10);
        camera.lookAt(this.player.getMesh().position);
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

        // Create physics materials
        const groundPhysicsMaterial = new CANNON.Material('groundMaterial');
        const playerPhysicsMaterial = new CANNON.Material('playerMaterial');

        // Create contact material between ground and player
        const groundPlayerContactMaterial = new CANNON.ContactMaterial(
            groundPhysicsMaterial,
            playerPhysicsMaterial,
            {
                friction: 0.5,
                restitution: 0.3
            }
        );
        this.physicsManager.getWorld().addContactMaterial(groundPlayerContactMaterial);

        // Create ground physics body
        const groundBody = new CANNON.Body({
            mass: 0, // Static body
            material: groundPhysicsMaterial,
            shape: new CANNON.Plane()
        });
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        groundBody.position.set(0, -1, 0);
        this.physicsManager.getWorld().addBody(groundBody);

        // Request pointer lock for mouse control
        this.inputManager.requestPointerLock();
    }

    public stop(): void {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        this.sceneManager.stop();
        this.inputManager.exitPointerLock();
    }

    public update(deltaTime: number): void {
        // Update player based on input
        const input = this.inputManager.getPlayerInput();
        this.player.update(deltaTime, input);

        // Update camera to follow player
        const camera = this.sceneManager.getCamera();
        const playerPos = this.player.getMesh().position;
        camera.position.x = playerPos.x;
        camera.position.z = playerPos.z + 10;
        camera.lookAt(playerPos);
    }

    public getSceneManager(): SceneManager {
        return this.sceneManager;
    }

    public getPhysicsManager(): PhysicsManager {
        return this.physicsManager;
    }

    public getPlayer(): Player {
        return this.player;
    }
} 