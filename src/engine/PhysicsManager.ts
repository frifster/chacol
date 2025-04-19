import * as CANNON from 'cannon-es';
import { World } from 'cannon-es';
import * as THREE from 'three';

export class PhysicsManager {
    private world: World;
    private physicsBodies: Map<THREE.Object3D, CANNON.Body>;
    private meshes: Map<CANNON.Body, THREE.Object3D>;

    constructor(world: World) {
        this.world = world;
        this.physicsBodies = new Map();
        this.meshes = new Map();
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

    public update(): void {
        // Update mesh positions and rotations based on physics bodies
        this.meshes.forEach((mesh, body) => {
            mesh.position.copy(body.position as unknown as THREE.Vector3);
            mesh.quaternion.copy(body.quaternion as unknown as THREE.Quaternion);
        });
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
} 