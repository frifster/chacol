import * as CANNON from 'cannon-es';
import { World } from 'cannon-es';
import * as THREE from 'three';
import { PhysicsManager } from './PhysicsManager';

export class SceneManager {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private world: World;
    private physicsManager: PhysicsManager;
    private clock: THREE.Clock;
    private animationFrameId: number | null = null;

    constructor() {
        // Initialize Three.js scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);

        // Setup camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);

        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // Style the canvas
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.width = '100%';
        this.renderer.domElement.style.height = '100%';
        this.renderer.domElement.style.zIndex = '0';
        
        // Find the game container and append the canvas
        const gameContainer = document.querySelector('.game-container');
        if (gameContainer) {
            gameContainer.appendChild(this.renderer.domElement);
        } else {
            console.error('Game container not found');
        }

        // Initialize physics world
        this.world = new World({
            gravity: new CANNON.Vec3(0, -9.82, 0)
        });

        // Initialize physics manager
        this.physicsManager = new PhysicsManager(this.world);

        // Setup clock for animation
        this.clock = new THREE.Clock();

        // Handle window resize
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    private handleResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    public start(): void {
        this.clock.start();
        this.animate();
    }

    public stop(): void {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    private animate(): void {
        this.animationFrameId = requestAnimationFrame(this.animate.bind(this));

        const delta = this.clock.getDelta();
        
        // Update physics world
        this.world.step(1/60);
        
        // Update physics bodies to match their meshes
        this.physicsManager.update();

        // Render scene
        this.renderer.render(this.scene, this.camera);
    }

    public getScene(): THREE.Scene {
        return this.scene;
    }

    public getCamera(): THREE.PerspectiveCamera {
        return this.camera;
    }

    public getWorld(): World {
        return this.world;
    }

    public getPhysicsManager(): PhysicsManager {
        return this.physicsManager;
    }

    public add(object: THREE.Object3D): void {
        this.scene.add(object);
    }

    public remove(object: THREE.Object3D): void {
        this.scene.remove(object);
    }
} 