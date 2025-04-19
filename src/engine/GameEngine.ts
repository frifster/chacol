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
    private torchIntervals: number[] = []; // Store intervals for cleanup

    constructor(container: HTMLElement) {
        this.gameContainer = container;
        this.scene = new THREE.Scene();
        
        // Simplified fog for better performance
        this.scene.fog = new THREE.Fog(0x1a1a1a, 20, 100);

        // Create skybox with gradient effect
        const skyboxGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
        const skyboxMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x222233,
            side: THREE.BackSide,
            fog: false
        });
        const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
        this.scene.add(skybox);

        // Set up 2D orthographic camera
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.OrthographicCamera(
            -20 * aspect, // left - reduced from -50 for closer view
            20 * aspect,  // right - reduced from 50 for closer view
            20,          // top - reduced from 50 for closer view
            -20,         // bottom - reduced from -50 for closer view
            0.1,         // near
            1000         // far
        );
        this.camera.position.set(0, 0, 10);
        this.camera.lookAt(0, 0, 0);

        // Optimize renderer settings
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: false, // Disable antialiasing for better performance
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.BasicShadowMap; // Use basic shadow map for better performance
        container.appendChild(this.renderer.domElement);

        // Create physics world
        const world = new CANNON.World();
        world.gravity.set(0, -9.82, 0); // Set gravity for 2D physics

        // Initialize managers
        this.physicsManager = new PhysicsManager(world);
        this.inputManager = new InputManager();

        // Create dungeon environment
        this.createDungeonEnvironment();

        // Create player at a specific position
        const playerStartPosition = new THREE.Vector3(0, 5, 0);
        this.player = new Player(this.scene, this.physicsManager, playerStartPosition);

        // Position camera to show player
        this.camera.position.set(playerStartPosition.x, playerStartPosition.y, 10);
        this.camera.lookAt(playerStartPosition);

        // Create HUD
        this.createHUD();

        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));

        // Start rendering
        this.renderer.render(this.scene, this.camera);
    }

    private createDungeonEnvironment(): void {
        // Create floor with enhanced material
        const floorGeometry = new THREE.PlaneGeometry(100, 100);
        const floorMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x444444,
            shininess: 10,
            specular: 0x222222
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = 0;
        floor.receiveShadow = true;
        this.scene.add(floor);

        // Create ground physics body
        const groundShape = new CANNON.Plane();
        const groundBody = new CANNON.Body({
            mass: 0, // Static body
            shape: groundShape,
            material: new CANNON.Material('groundMaterial')
        });
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        groundBody.position.set(0, 0, 0);
        this.physicsManager.getWorld().addBody(groundBody);

        // Set up contact material between ground and player
        const groundMaterial = new CANNON.Material('groundMaterial');
        const playerMaterial = new CANNON.Material('playerMaterial');
        const groundPlayerContact = new CANNON.ContactMaterial(
            groundMaterial,
            playerMaterial,
            {
                friction: 0.5,
                restitution: 0.0
            }
        );
        this.physicsManager.getWorld().addContactMaterial(groundPlayerContact);

        // Optimize lighting setup
        const ambientLight = new THREE.AmbientLight(0x333333, 0.6);
        this.scene.add(ambientLight);

        // Simplified hemisphere light
        const hemisphereLight = new THREE.HemisphereLight(0x6688cc, 0x553333, 0.3);
        this.scene.add(hemisphereLight);

        // Optimize torch lights
        const torchPositions = [-40, -20, 0, 20, 40]; // Reduced number of torches
        torchPositions.forEach(x => {
            // Create torch base with simplified geometry
            const torchGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 6);
            const torchMaterial = new THREE.MeshPhongMaterial({
                color: 0x553322,
                shininess: 30
            });
            const torch = new THREE.Mesh(torchGeometry, torchMaterial);
            torch.position.set(x, 10, -1);
            torch.castShadow = false; // Disable individual torch shadows
            this.scene.add(torch);

            // Simplified torch light
            const torchLight = new THREE.PointLight(0xff6633, 1.5, 15);
            torchLight.position.set(x, 12, -1);
            torchLight.castShadow = false;
            this.scene.add(torchLight);

            // More efficient flickering with shared interval
            const intensity = torchLight.intensity;
            const intervalId = window.setInterval(() => {
                torchLight.intensity = intensity * (0.95 + Math.random() * 0.1);
            }, 100); // Reduced frequency of updates
            this.torchIntervals.push(intervalId);

            // Simplified torch glow
            const glowGeometry = new THREE.SphereGeometry(0.3, 6, 6);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: 0xff6633,
                transparent: true,
                opacity: 0.4
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            glow.position.set(x, 12, -1);
            this.scene.add(glow);
        });
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
        const mesh = this.player?.getMesh();
        if (!mesh) {
            this.hudElement.textContent = 'Position: No player mesh';
            return;
        }

        const position = mesh.position;
        const x = Math.round(position.x * 100) / 100;
        const y = Math.round(position.y * 100) / 100;
        this.hudElement.textContent = `Position: X: ${x}, Y: ${y}`;
    }

    private onWindowResize(): void {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera.left = -20 * aspect;
        this.camera.right = 20 * aspect;
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

        // Update player
        const input = this.inputManager.getPlayerInput();
        this.player.update(deltaTime, input);

        // Update camera
        const playerMesh = this.player.getMesh();
        if (playerMesh) {
            this.camera.position.x = playerMesh.position.x;
            this.camera.position.y = playerMesh.position.y;
            this.camera.position.z = 10;
            this.camera.lookAt(playerMesh.position);
        }

        this.updateHUD();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.gameLoop());
    }

    public getPlayer(): Player {
        return this.player;
    }

    // Add cleanup method
    public cleanup(): void {
        // Clear all torch intervals
        this.torchIntervals.forEach(intervalId => {
            clearInterval(intervalId);
        });
        this.torchIntervals = [];
    }
} 