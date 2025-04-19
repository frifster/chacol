import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { InputManager } from './InputManager';
import { PhysicsManager } from './PhysicsManager';
import { Player } from './Player';

export class GameEngine {
    private scene: THREE.Scene;
    private camera: THREE.OrthographicCamera;
    private renderer: THREE.WebGLRenderer;
    private player: Player;
    private physicsManager: PhysicsManager;
    private inputManager: InputManager;
    private hudElement!: HTMLDivElement;
    private lastTime: number = 0;
    private gameContainer: HTMLElement;

    constructor(container: HTMLElement) {
        this.gameContainer = container;
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue background

        // Set up 2D orthographic camera
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.OrthographicCamera(
            -50 * aspect, // left
            50 * aspect,  // right
            50,          // top
            -50,         // bottom
            0.1,         // near
            1000         // far
        );
        this.camera.position.set(0, 0, 10);
        this.camera.lookAt(0, 0, 0);

        // Set up renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(this.renderer.domElement);

        // Create physics world
        const world = new CANNON.World();
        world.gravity.set(0, -9.82, 0); // Set gravity for 2D physics

        // Initialize managers
        this.physicsManager = new PhysicsManager(world);
        this.inputManager = new InputManager();

        // Create player
        this.player = new Player(this.scene, this.physicsManager, new THREE.Vector3(0, 2, 0));

        // Create ground (2D plane)
        const groundGeometry = new THREE.PlaneGeometry(100, 10);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8B4513, // Brown color for ground
            side: THREE.DoubleSide
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = Math.PI / 2; // Rotate to be horizontal
        ground.position.y = -5; // Position below player
        this.scene.add(ground);

        // Add physics body for ground
        this.physicsManager.createBox(ground, 0, new CANNON.Material('groundMaterial'));

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 1, 0);
        this.scene.add(directionalLight);

        // Create HUD
        this.createHUD();

        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    private createHUD(): void {
        this.hudElement = document.createElement('div');
        this.hudElement.style.position = 'absolute';
        this.hudElement.style.top = '80px';
        this.hudElement.style.left = '20px';
        this.hudElement.style.color = 'white';
        this.hudElement.style.fontFamily = 'Arial';
        this.hudElement.style.fontSize = '16px';
        this.hudElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        this.hudElement.style.padding = '10px';
        this.hudElement.style.borderRadius = '5px';
        this.gameContainer.appendChild(this.hudElement);
    }

    private updateHUD(): void {
        const position = this.player.getMesh().position;
        this.hudElement.textContent = `Position: X: ${position.x.toFixed(2)}, Y: ${position.y.toFixed(2)}`;
    }

    private onWindowResize(): void {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera.left = -50 * aspect;
        this.camera.right = 50 * aspect;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    public start(): void {
        this.lastTime = performance.now();
        this.gameLoop();
    }

    private gameLoop(): void {
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        // Update physics
        this.physicsManager.update(deltaTime);

        // Get input and update player
        const input = this.inputManager.getPlayerInput();
        this.player.update(deltaTime, input);

        // Update camera to follow player
        const playerPos = this.player.getMesh().position;
        this.camera.position.x = playerPos.x;
        this.camera.position.y = playerPos.y;

        // Update HUD
        this.updateHUD();

        // Render scene
        this.renderer.render(this.scene, this.camera);

        // Continue game loop
        requestAnimationFrame(() => this.gameLoop());
    }

    public getPlayer(): Player {
        return this.player;
    }
} 