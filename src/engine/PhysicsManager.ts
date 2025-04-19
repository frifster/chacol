import * as CANNON from 'cannon-es';
import { World } from 'cannon-es';
import * as THREE from 'three';
import { Mesh, Object3D } from 'three';
import { Player } from './Player';

export class PhysicsManager {
    private world: World;
    private physicsBodies: Map<THREE.Object3D, CANNON.Body>;
    private meshes: Map<CANNON.Body, THREE.Object3D>;
    private player: Player | null = null;

    constructor(world: World) {
        this.world = world;
        this.physicsBodies = new Map();
        this.meshes = new Map();
    }

    public getWorld(): World {
        return this.world;
    }

    setPlayer(player: Player) {
        this.player = player;
    }

    public createBox(
        mesh: THREE.Mesh,
        mass: number = 0,
        material: CANNON.Material = new CANNON.Material('default')
    ): CANNON.Body {
        const boxGeometry = mesh.geometry as THREE.BoxGeometry;
        const shape = new CANNON.Box(new CANNON.Vec3(
            boxGeometry.parameters.width / 2,
            boxGeometry.parameters.height / 2,
            boxGeometry.parameters.depth / 2
        ));

        const body = new CANNON.Body({
            mass,
            material,
            shape,
            position: new CANNON.Vec3(
                mesh.position.x,
                mesh.position.y,
                mesh.position.z
            ),
            quaternion: new CANNON.Quaternion(
                mesh.quaternion.x,
                mesh.quaternion.y,
                mesh.quaternion.z,
                mesh.quaternion.w
            )
        });

        this.world.addBody(body);
        this.physicsBodies.set(mesh, body);
        this.meshes.set(body, mesh);

        return body;
    }

    public createSphere(
        mesh: THREE.Mesh,
        mass: number = 0,
        material: CANNON.Material = new CANNON.Material('default')
    ): CANNON.Body {
        const sphereGeometry = mesh.geometry as THREE.SphereGeometry;
        const shape = new CANNON.Sphere(sphereGeometry.parameters.radius);

        const body = new CANNON.Body({
            mass,
            material,
            shape,
            position: new CANNON.Vec3(
                mesh.position.x,
                mesh.position.y,
                mesh.position.z
            ),
            quaternion: new CANNON.Quaternion(
                mesh.quaternion.x,
                mesh.quaternion.y,
                mesh.quaternion.z,
                mesh.quaternion.w
            )
        });

        this.world.addBody(body);
        this.physicsBodies.set(mesh, body);
        this.meshes.set(body, mesh);

        return body;
    }

    public update(deltaTime: number): void {
        this.world.step(deltaTime);
        
        // Update mesh positions to match physics bodies
        this.meshes.forEach((mesh, body) => {
            if (mesh instanceof Mesh) {
                mesh.position.copy(body.position as any);
                mesh.quaternion.copy(body.quaternion as any);
            }
        });

        // Update player position if it exists
        if (this.player) {
            const playerBody = this.physicsBodies.get(this.player.getMesh());
            if (playerBody) {
                this.player.updatePosition(playerBody.position as any);
            }
        }
    }

    public removeBody(mesh: THREE.Object3D): void {
        const body = this.physicsBodies.get(mesh);
        if (body) {
            this.world.removeBody(body);
            this.physicsBodies.delete(mesh);
            this.meshes.delete(body);
        }
    }

    public addContactMaterial(
        material1: CANNON.Material,
        material2: CANNON.Material,
        options: CANNON.ContactMaterialOptions
    ): void {
        const contactMaterial = new CANNON.ContactMaterial(material1, material2, options);
        this.world.addContactMaterial(contactMaterial);
    }

    public getBody(mesh: THREE.Object3D): CANNON.Body | undefined {
        return this.physicsBodies.get(mesh);
    }

    addBody(mesh: Object3D, body: CANNON.Body) {
        this.physicsBodies.set(mesh, body);
        this.world.addBody(body);
    }

    createGroundBody(mesh: Mesh, width: number, height: number, depth: number): CANNON.Body {
        const groundShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        const groundMaterial = new CANNON.Material('groundMaterial');
        const groundBody = new CANNON.Body({
            mass: 0, // Static body
            shape: groundShape,
            position: new CANNON.Vec3(
                mesh.position.x,
                mesh.position.y,
                mesh.position.z
            ),
            material: groundMaterial
        });

        // Set high friction and restitution for better collision response
        groundMaterial.friction = 0.5;
        groundMaterial.restitution = 0.3;

        return groundBody;
    }

    createPlayerBody(mesh: Mesh, width: number, height: number, depth: number): CANNON.Body {
        const playerShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        const playerMaterial = new CANNON.Material('playerMaterial');
        const playerBody = new CANNON.Body({
            mass: 1,
            shape: playerShape,
            position: new CANNON.Vec3(
                mesh.position.x,
                mesh.position.y,
                mesh.position.z
            ),
            material: playerMaterial
        });

        // Set player-specific physics properties
        playerMaterial.friction = 0.3;
        playerMaterial.restitution = 0.2;
        playerBody.linearDamping = 0.5; // Add some damping to prevent sliding
        playerBody.angularDamping = 0.5;

        return playerBody;
    }
} 