import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { DungeonManager } from '../game/dungeon/DungeonManager';
import { InputManager } from './InputManager';
import { PhysicsManager } from './PhysicsManager';
import { Player } from './Player';

// Define collision groups (matching Player.ts)
const COLLISION_GROUPS = {
    WORLD: 1,
    ENEMY: 2,
    PLAYER: 4
};

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
    private dungeonManager: DungeonManager;
    private dungeonMeshes: THREE.Mesh[] = []; // Store dungeon meshes for cleanup
    private deathHeight: number = -10; // Height at which player dies
    private isGameOver: boolean = false;
    private gameOverCallback?: () => void;

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

        // Set up 2D orthographic camera for side view
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.OrthographicCamera(
            -20 * aspect,
            20 * aspect,
            20,
            -20,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 10);
        this.camera.lookAt(0, 0, 0);

        // Optimize renderer settings
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: false,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.BasicShadowMap;
        container.appendChild(this.renderer.domElement);

        // Create physics world with 2D gravity
        const world = new CANNON.World();
        world.gravity.set(0, -9.82, 0);

        // Initialize physics manager
        this.physicsManager = new PhysicsManager(world);

        // Initialize managers
        this.inputManager = new InputManager();
        this.dungeonManager = new DungeonManager(
            this.scene,
            this.physicsManager
        );

        // Create dungeon environment
        this.createDungeonEnvironment();

        // Create player at a specific position
        const playerStartPosition = new THREE.Vector3(0, 5, 0);
        this.player = new Player(this.scene, this.physicsManager, playerStartPosition);
        
        // Set up player death handler
        this.player.setOnDeath(() => {
            this.handleGameOver();
        });

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
        // Generate new dungeon
        this.dungeonManager.generateNewDungeon();
        const dungeon = this.dungeonManager.getCurrentDungeon();
        
        if (!dungeon) return;

        // Create floor material
        const floorMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x444444,
            shininess: 10,
            specular: 0x222222
        });

        // Create wall material
        const wallMaterial = new THREE.MeshPhongMaterial({
            color: 0x333333,
            shininess: 5,
            specular: 0x111111
        });

        // Create rooms
        for (const room of dungeon.rooms) {
            // Create room floor (platform)
            const floorGeometry = new THREE.BoxGeometry(room.width, 1, 1);
            const floor = new THREE.Mesh(floorGeometry, floorMaterial);
            floor.position.set(room.position.x, -0.5, 0);
            floor.receiveShadow = true;
            this.scene.add(floor);
            this.dungeonMeshes.push(floor);

            // Add physics body for floor with collision groups
            const floorShape = new CANNON.Box(new CANNON.Vec3(room.width/2, 0.5, 0.5));
            const floorBody = new CANNON.Body({
                mass: 0,
                shape: floorShape,
                position: new CANNON.Vec3(room.position.x, -0.5, 0),
                collisionFilterGroup: COLLISION_GROUPS.WORLD,
                collisionFilterMask: COLLISION_GROUPS.PLAYER,
                material: this.physicsManager.getMaterial('world')
            });
            this.physicsManager.getWorld().addBody(floorBody);

            // Create walls for each side with collision groups
            const walls = [
                { width: 1, height: 5, position: [-room.width/2, 2.5, 0] },
                { width: 1, height: 5, position: [room.width/2, 2.5, 0] }
            ];

            for (const wall of walls) {
                const wallGeometry = new THREE.BoxGeometry(wall.width, wall.height, 1);
                const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
                wallMesh.position.set(
                    room.position.x + wall.position[0],
                    wall.position[1],
                    0
                );
                wallMesh.castShadow = true;
                wallMesh.receiveShadow = true;
                this.scene.add(wallMesh);
                this.dungeonMeshes.push(wallMesh);

                const wallShape = new CANNON.Box(new CANNON.Vec3(wall.width/2, wall.height/2, 0.5));
                const wallBody = new CANNON.Body({
                    mass: 0,
                    shape: wallShape,
                    position: new CANNON.Vec3(
                        room.position.x + wall.position[0],
                        wall.position[1],
                        0
                    ),
                    collisionFilterGroup: COLLISION_GROUPS.WORLD,
                    collisionFilterMask: COLLISION_GROUPS.PLAYER,
                    material: this.physicsManager.getMaterial('world')
                });
                this.physicsManager.getWorld().addBody(wallBody);
            }
        }

        // Create corridors with collision groups
        for (const corridor of dungeon.corridors) {
            const corridorLength = Math.abs(corridor.start.x - corridor.end.x);
            const corridorGeometry = new THREE.BoxGeometry(corridorLength, 1, 1);
            const corridorMesh = new THREE.Mesh(corridorGeometry, floorMaterial);
            
            const midpoint = new THREE.Vector3().addVectors(corridor.start, corridor.end).multiplyScalar(0.5);
            corridorMesh.position.set(midpoint.x, -0.5, 0);
            
            corridorMesh.receiveShadow = true;
            this.scene.add(corridorMesh);
            this.dungeonMeshes.push(corridorMesh);

            const corridorShape = new CANNON.Box(new CANNON.Vec3(corridorLength/2, 0.5, 0.5));
            const corridorBody = new CANNON.Body({
                mass: 0,
                shape: corridorShape,
                position: new CANNON.Vec3(midpoint.x, -0.5, 0),
                collisionFilterGroup: COLLISION_GROUPS.WORLD,
                collisionFilterMask: COLLISION_GROUPS.PLAYER,
                material: this.physicsManager.getMaterial('world')
            });
            this.physicsManager.getWorld().addBody(corridorBody);
        }

        this.setupDungeonLighting(dungeon);
    }

    private setupDungeonLighting(dungeon: any): void {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x333333, 0.6);
        this.scene.add(ambientLight);

        // Directional light for 2D effect
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 10, 0);
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

        // Check for game over
        const playerMesh = this.player.getMesh();
        if (playerMesh && playerMesh.position.y <= this.deathHeight && !this.isGameOver) {
            console.log('Game Over triggered! Player Y:', playerMesh.position.y, 'Death Height:', this.deathHeight);
            this.isGameOver = true;
            if (this.gameOverCallback) {
                console.log('Calling game over callback');
                this.gameOverCallback();
            }
        }

        // Only update game state if not game over
        if (!this.isGameOver) {
            // Update physics
            this.physicsManager.update(deltaTime);

            // Update player
            const input = this.inputManager.getPlayerInput();
            this.player.update(deltaTime, input);

            // Update enemies
            this.dungeonManager.update(deltaTime);

            // Update camera to follow player
            if (playerMesh) {
                this.camera.position.x = playerMesh.position.x;
                this.camera.position.y = playerMesh.position.y;
                this.camera.lookAt(playerMesh.position);
            }
        }

        this.updateHUD();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.gameLoop());
    }

    public getPlayer(): Player {
        return this.player;
    }

    public cleanup(): void {
        // Clear all torch intervals
        this.torchIntervals.forEach(intervalId => {
            clearInterval(intervalId);
        });
        this.torchIntervals = [];

        // Remove all dungeon meshes
        this.dungeonMeshes.forEach(mesh => {
            this.scene.remove(mesh);
            mesh.geometry.dispose();
            if (Array.isArray(mesh.material)) {
                mesh.material.forEach(material => material.dispose());
            } else {
                mesh.material.dispose();
            }
        });
        this.dungeonMeshes = [];
    }

    public setGameOverCallback(callback: () => void): void {
        this.gameOverCallback = callback;
    }

    public resetGame(): void {
        console.log('Resetting game...');
        this.isGameOver = false;
        
        // Reset player position and state
        const playerStartPosition = new THREE.Vector3(0, 5, 0);
        const playerMesh = this.player.getMesh();
        const playerBody = this.player.getBody();
        
        if (playerMesh && playerBody) {
            // Reset position
            playerMesh.position.copy(playerStartPosition);
            playerBody.position.copy(playerStartPosition as any);
            
            // Reset velocity and rotation
            playerBody.velocity.set(0, 0, 0);
            playerBody.angularVelocity.set(0, 0, 0);
            
            // Reset player state
            this.player.resetState();
        }

        // Reset camera position
        this.camera.position.set(playerStartPosition.x, playerStartPosition.y, 10);
        this.camera.lookAt(playerStartPosition);

        // Force a render to update the view
        this.renderer.render(this.scene, this.camera);
    }

    private handleGameOver(): void {
        this.isGameOver = true;
        
        // Create game over overlay
        const gameOverDiv = document.createElement('div');
        gameOverDiv.style.position = 'absolute';
        gameOverDiv.style.top = '50%';
        gameOverDiv.style.left = '50%';
        gameOverDiv.style.transform = 'translate(-50%, -50%)';
        gameOverDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        gameOverDiv.style.color = 'white';
        gameOverDiv.style.padding = '20px';
        gameOverDiv.style.borderRadius = '10px';
        gameOverDiv.style.textAlign = 'center';
        gameOverDiv.style.fontFamily = 'Arial, sans-serif';
        gameOverDiv.style.zIndex = '1000';

        const gameOverText = document.createElement('h2');
        gameOverText.textContent = 'Game Over';
        gameOverText.style.margin = '0 0 20px 0';
        gameOverDiv.appendChild(gameOverText);

        const restartButton = document.createElement('button');
        restartButton.textContent = 'Restart';
        restartButton.style.padding = '10px 20px';
        restartButton.style.fontSize = '16px';
        restartButton.style.cursor = 'pointer';
        restartButton.style.backgroundColor = '#4CAF50';
        restartButton.style.border = 'none';
        restartButton.style.borderRadius = '5px';
        restartButton.style.color = 'white';
        restartButton.onclick = () => this.restartGame(gameOverDiv);
        gameOverDiv.appendChild(restartButton);

        this.gameContainer.appendChild(gameOverDiv);
    }

    private restartGame(gameOverDiv: HTMLDivElement): void {
        // Remove game over overlay
        this.gameContainer.removeChild(gameOverDiv);
        
        // Reset game state
        this.isGameOver = false;
        
        // Reset player
        const playerStartPosition = new THREE.Vector3(0, 5, 0);
        this.player.resetState();
        this.player.updatePosition(playerStartPosition);
        
        // Reset camera
        this.camera.position.set(playerStartPosition.x, playerStartPosition.y, 10);
        this.camera.lookAt(playerStartPosition);
        
        // Regenerate dungeon
        this.cleanup();
        this.createDungeonEnvironment();
    }
} 