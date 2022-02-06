import * as THREE from "three";
import * as CANNON from 'cannon-es'
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';
import { Geometry, Face3 } from 'three/examples/jsm/deprecated/Geometry';
import Svg from "servisofts-component/img/Svg";
import HeightField from "../HeightField";
type ShapeCannon = "Convex" | "Sphere" | "Cylinder" | "Plane" | "Box" | "Trimesh" | "Heightfield";
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
    meshDebug;
    mesh;
    props;
    click;
    cmesh;
    constructor(main, props: tProps) {
        this.props = props;
        this.main = main;
        let cmesh;

        let sc = this.getScaleInWolrd(props.mesh);
        let ps = this.getPositionInWolrd(props.mesh);
        // let space = 0.018;
        let space = 0.04;
        this.mesh = props.mesh;

        switch (props.type) {
            case "Heightfield":
                // sc.x = sc.x + space;
                // sc.y = sc.y + space;
                // sc.z = sc.z + space;
                let hf = new HeightField(this, {
                    scale: sc,
                    position: ps,
                    debug: true
                });
                cmesh = hf.CreateHeightfield(props.mesh);
                this.cmesh = cmesh;
                break;
            case "Trimesh":
                sc.x = sc.x + space;
                sc.y = sc.y + space;
                sc.z = sc.z + space;
                cmesh = this.CreateConvexMesh(props.mesh, sc, ps);
                this.addConvexHelper(props.mesh, sc, ps);
                // cmesh = threeToCannon(props.mesh, {
                //     type: ShapeType.HULL
                // });
                break;
            case "Convex":
                sc.x = sc.x + space;
                sc.y = sc.y + space;
                sc.z = sc.z + space;
                cmesh = this.CreateConvexMesh(props.mesh, sc, ps);
                this.addConvexHelper(props.mesh, sc, ps);
                break;
            case "Sphere":
                cmesh = new CANNON.Sphere(sc.z);
                this.addSphereHelper(sc, ps, space);
                break;
            case "Plane":
                cmesh = new CANNON.Plane();
                break;
            case "Box":
                cmesh = new CANNON.Box(new CANNON.Vec3(sc.x + space, sc.y + space, sc.z + space));
                this.addBoxHelper(sc, ps, space);
                break;
            case "Cylinder":
                cmesh = new CANNON.Cylinder(sc.x, sc.y, sc.z, 62);
        }


        if (!cmesh) return;

        let cbody = new CANNON.Body({
            mass: props.mass,
            shape: cmesh,
            material: props.material,
            linearDamping: 0.4,
            angularDamping: 0.4,
            collisionResponse: true
        });

        cbody.position.copy(ps);
        cbody.quaternion.copy(props.mesh.quaternion);
        main.world.addBody(cbody);
        this.cbody = cbody;

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
        if (this.meshDebug) {
            var mesh = this.meshDebug;
            mesh.receiveShadow = true;
            mesh.castShadow = true;
            if (mesh.children) {
                for (var i = 0; i < mesh.children.length; i++) {
                    mesh.children[i].castShadow = true;
                    mesh.children[i].receiveShadow = true;
                    if (mesh.children[i]) {
                        for (var j = 0; j < mesh.children[i].length; j++) {
                            mesh.children[i].children[j].castShadow = true;
                            mesh.children[i].children[j].receiveShadow = true;
                        }
                    }
                }
            }

        }



    }

    addBoxHelper(sc, ps, space) {
        this.meshDebug = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial({ color: 0x00ff00, opacity: 0.5, transparent: true }));
        this.meshDebug.scale.set(sc.x + space, sc.y + space, sc.z + space);
        this.meshDebug.position.copy(ps);
        this.meshDebug.quaternion.copy(this.mesh.quaternion);
        this.main.scene.add(this.meshDebug);
    }
    addSphereHelper(sc, ps, space) {
        this.meshDebug = new THREE.Mesh(new THREE.SphereGeometry(sc.z, 32, 16), new THREE.MeshBasicMaterial({ color: 0x00ff00, opacity: 0.5, transparent: true }));
        // this.meshDebug.scale.set(sc.z + space, sc.z + space, sc.z + space);
        this.meshDebug.position.copy(ps);
        this.meshDebug.quaternion.copy(this.mesh.quaternion);
        this.main.scene.add(this.meshDebug);
    }
    addConvexHelper(mesh, sc, ps) {
        try {
            const vertices = [];
            const position = mesh.geometry.attributes.position.array;
            for (let i = 0; i < position.length; i += 3) {
                vertices.push(
                    new THREE.Vector3(position[i] * sc.x, position[i + 1] * sc.y, position[i + 2] * sc.z)
                )
            }
            this.meshDebug = new THREE.Mesh(new ConvexGeometry(vertices), new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.5, transparent: true }));
            // this.meshDebug.scale.set(sc.x, sc.y, sc.z);
            this.meshDebug.position.copy(ps);
            this.meshDebug.quaternion.copy(this.mesh.quaternion);
            this.main.scene.add(this.meshDebug);
            return this.meshDebug;
        } catch (e) {
            console.log(e);
        }

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
    CreateTrimesh(geometry: THREE.BufferGeometry, sc) {
        var position = geometry.attributes.position.array
        var vertices = []
        // for (let i = 0; i < position.length; i += 3) {
        //     vertices.push(
        //         new THREE.Vector3(position[i] * sc.x, position[i + 1] * sc.y, position[i + 2] * sc.z)
        //     )
        // }
        const indices = Object.keys(position).map(Number)
        return new CANNON.Trimesh(position, indices)
    }


    CreateConvexMesh(mesh, sc, ps) {
        let geometry = mesh.geometry;
        let scale = mesh.scale;
        let vertices = [], faces = [], faceNormal = [];
        var position = geometry.attributes.position.array
        var icosahedronPoints = []

        for (let i = 0; i < position.length; i += 3) {
            icosahedronPoints.push(
                new CANNON.Vec3(position[i] * sc.x, position[i + 1] * sc.y, position[i + 2] * sc.z)
            )
        }
        let geomFaces = geometry.index.array;
        for (var i = 0; i < geomFaces.length; i += 3) {
            faces.push([geomFaces[i], geomFaces[i + 1], geomFaces[i + 2]]);
        }
        var faceNormals = geometry.attributes.normal.array;
        var normals = []
        for (var i = 0; i < faceNormals.length; i += 3) {
            normals.push(new CANNON.Vec3(faceNormals[i], faceNormals[i + 1], faceNormals[i + 2]));
        }

        return new CANNON.ConvexPolyhedron({
            vertices: icosahedronPoints,
            faces: faces,
            normals: normals
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
        let relativeVector = new CANNON.Vec3(0, n, 0);
        this.cbody.quaternion.vmult(relativeVector, relativeVector);
        this.cbody.position.vadd(relativeVector, this.cbody.position);
    }
    translateZ(n) {
        let relativeVector = new CANNON.Vec3(0, 0, n);
        this.cbody.quaternion.vmult(relativeVector, relativeVector);
        this.cbody.position.vadd(relativeVector, this.cbody.position);
    }
    rotate(x, y, z) {
        this.mesh.rotation.x += x;
        this.mesh.rotateY(y);
        this.mesh.rotation.z += z;
        this.cbody.quaternion.setFromEuler(this.mesh.rotation.x, this.mesh.rotation.y, this.mesh.rotation.z);
    }
    render() {
        if (this.cbody) {
            this.mesh.position.copy(this.cbody.position);
            this.mesh.quaternion.copy(this.cbody.quaternion);
        }
        if (this.meshDebug) {
            this.meshDebug.position.copy(this.cbody.position);
            this.meshDebug.quaternion.copy(this.cbody.quaternion);
        }
    }
}
