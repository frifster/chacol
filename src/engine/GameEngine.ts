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
        this.scene.background = new THREE.Color(0x1a1a1a); // Dark background for dungeon

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

        // Set up renderer with shadows
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
        // Create floor with stone pattern
        const floorGeometry = new THREE.PlaneGeometry(100, 100);
        const floorMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x444444, // Dark gray
            roughness: 0.8,
            metalness: 0.2,
            flatShading: true
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = 0; // Move floor to y=0
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

        // Create walls with brick-like pattern
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0x553333, // Dark reddish-brown
            roughness: 0.9,
            metalness: 0.1,
            flatShading: true
        });

        // Left wall
        const leftWall = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 20),
            wallMaterial.clone()
        );
        leftWall.position.set(-50, 10, 0); // Adjust wall height
        leftWall.rotation.y = Math.PI / 2;
        leftWall.castShadow = true;
        leftWall.receiveShadow = true;
        this.scene.add(leftWall);

        // Right wall
        const rightWall = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 20),
            wallMaterial.clone()
        );
        rightWall.position.set(50, 10, 0); // Adjust wall height
        rightWall.rotation.y = -Math.PI / 2;
        rightWall.castShadow = true;
        rightWall.receiveShadow = true;
        this.scene.add(rightWall);

        // Add decorative elements (pillars)
        const pillarGeometry = new THREE.BoxGeometry(2, 15, 2);
        const pillarMaterial = new THREE.MeshStandardMaterial({
            color: 0x666666, // Gray
            roughness: 0.7,
            metalness: 0.3
        });

        // Add pillars along the walls
        for (let x = -40; x <= 40; x += 20) {
            // Left side pillars
            const leftPillar = new THREE.Mesh(pillarGeometry, pillarMaterial.clone());
            leftPillar.position.set(x, 7.5, -1); // Adjust pillar height
            leftPillar.castShadow = true;
            leftPillar.receiveShadow = true;
            this.scene.add(leftPillar);

            // Add torch light effect
            const torchLight = new THREE.PointLight(0xff6633, 1, 20);
            torchLight.position.set(x, 12, -1); // Adjust torch height
            torchLight.castShadow = true;
            this.scene.add(torchLight);

            // Add torch glow effect
            const torchGlow = new THREE.Mesh(
                new THREE.SphereGeometry(0.3, 8, 8),
                new THREE.MeshBasicMaterial({ color: 0xff6633 })
            );
            torchGlow.position.set(x, 12, -1); // Match torch light position
            this.scene.add(torchGlow);
        }

        // Add ambient lighting
        const ambientLight = new THREE.AmbientLight(0x333333, 0.5);
        this.scene.add(ambientLight);

        // Add directional light for general illumination
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
        directionalLight.position.set(0, 10, 10);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
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
        // Debug logging
        console.log('Player:', this.player);
        console.log('Player Mesh:', this.player?.getMesh());
        console.log('Player Position:', this.player?.getMesh()?.position);

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

        // Debug logging
        console.log('Game Loop - Player Position:', this.player?.getMesh()?.position);

        // Update physics
        this.physicsManager.update(deltaTime);

        // Get input and update player
        const input = this.inputManager.getPlayerInput();
        this.player.update(deltaTime, input);

        // Update camera to follow player
        const playerMesh = this.player.getMesh();
        if (playerMesh) {
            this.camera.position.x = playerMesh.position.x;
            this.camera.position.y = playerMesh.position.y;
            this.camera.position.z = 10; // Keep camera at fixed Z distance
            this.camera.lookAt(playerMesh.position);
        }

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