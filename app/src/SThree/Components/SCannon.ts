import * as THREE from "three";
import * as CANNON from 'cannon-es'

type ShapeCannon = "Convex" | "Sphere" | "Plane" | "Box";
type tProps = {
    mesh: THREE.Mesh,
    type: ShapeCannon,
    mass?: number,
    material?: CANNON.Material,
    castShadow?: boolean,
    recibeShadow?: boolean,
    click?: (intersec, evt) => void,
}
export default class SCannon {
    main;
    cbody: CANNON.Body;
    mesh;
    props;
    click;
    constructor(main, props: tProps) {
        this.props = props;
        this.main = main;
        let cmesh;

        let sc = this.getScaleInWolrd(props.mesh);
        let ps = this.getPositionInWolrd(props.mesh);

        switch (props.type) {
            case "Convex":
                cmesh = this.CreateConvexMesh(props.mesh);
                break;
            case "Sphere":
                cmesh = new CANNON.Sphere(sc.z);
                break;
            case "Plane":
                cmesh = new CANNON.Plane();
                break;
            case "Box":
                cmesh = new CANNON.Box(new CANNON.Vec3(sc.x, sc.y, sc.z));
                break;
        }




        let cbody = new CANNON.Body({ mass: props.mass, shape: cmesh, material: props.material, linearDamping: 0.4, angularDamping: 0.4, collisionResponse: true });

        cbody.position.copy(ps);
        cbody.quaternion.copy(props.mesh.quaternion);
        main.world.addBody(cbody);
        this.cbody = cbody;
        this.mesh = props.mesh;
        if (props.castShadow) {
            this.mesh.castShadow = true;
        }
        if (props.recibeShadow) {
            this.mesh.receiveShadow = true;
        }
        this.main.COLLITION.push(this.mesh);
        if (props.click) {
            this.click = props.click;
            main.addToClick(props.mesh.name, this);
        }
        main.addToRender('CannonItem-' + props.mesh.name, this);
    }

    getScaleInWolrd(mesh, props?) {
        if (!props) props = { x: 1, y: 1, z: 1 };
        if (!mesh) return { ...props };
        if (!mesh.parent) return { ...props };
        if (mesh.type == "Scene") return { ...props };
        return this.getScaleInWolrd(mesh.parent, { x: props.x * mesh.scale.x, y: props.y * mesh.scale.y, z: props.z * mesh.scale.z })
    }
    getPositionInWolrd(mesh, props?) {
        if (!props) props = { x: 0, y: 0, z: 0 };
        if (!mesh) return { ...props };
        if (!mesh.parent) return { ...props };
        if (mesh.type == "Scene") return { ...props };
        return this.getScaleInWolrd(mesh.parent, { x: props.x + mesh.position.x, y: props.y + mesh.position.y, z: props.z + mesh.position.z })
    }
    CreateConvexMesh(mesh) {
        let geometry = mesh.geometry;

        let scale = mesh.scale;
        let vertices = [], faces = [], faceNormal = [];
        var position = geometry.attributes.position.array
        var icosahedronPoints = []
        for (let i = 0; i < position.length; i += 3) {
            icosahedronPoints.push(
                new CANNON.Vec3(position[i] * scale.x, position[i + 1] * scale.y, position[i + 2] * scale.z)
            )
        }
        let geomFaces = geometry.index.array;
        for (var i = 0; i < geomFaces.length; i += 3) {
            faces.push([geomFaces[i], geomFaces[i + 1], geomFaces[i + 2]]);
        }
        // var faceNormals = geometry.attributes.normal.array;
        // var normals = []
        // for (var i = 0; i < faceNormals.length; i += 3) {
        //     normals.push(new CANNON.Vec3(faceNormals[i], faceNormals[i + 1], faceNormals[i + 2]));
        // }

        return new CANNON.ConvexPolyhedron({
            vertices: icosahedronPoints,
            faces: faces,
            // normals: normals
        })
    }
    impulse(force, direction) {
        this.cbody.applyImpulse(force, direction);

    }
    velocity(x, y, z) {
        this.cbody.velocity.set(x, y, z);
        // this.cbody.angularVelocity.set(0, 0, 0);/
    }
    translateX(n) {
        let relativeVector = new CANNON.Vec3(n, 0, 0);
        this.cbody.quaternion.vmult(relativeVector, relativeVector);
        this.cbody.position.vadd(relativeVector, this.cbody.position);
    }
    translateY(n) {
        // this.mesh.translateY(n);
        let relativeVector = new CANNON.Vec3(0, n, 0);
        this.cbody.quaternion.vmult(relativeVector, relativeVector);
        this.cbody.position.vadd(relativeVector, this.cbody.position);
        // this.cbody.position.y = this.mesh.position.y;
    }
    rotate(n) {
        this.mesh.rotateZ(n);
        this.cbody.quaternion.setFromEuler(this.mesh.rotation.x, this.mesh.rotation.y, this.mesh.rotation.z);

    }
    render() {
        if (this.cbody) {
            this.mesh.position.copy(this.cbody.position);
            this.mesh.quaternion.copy(this.cbody.quaternion);
        }
    }
}
