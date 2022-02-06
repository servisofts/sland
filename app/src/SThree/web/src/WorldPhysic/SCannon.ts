import * as THREE from "three";
import * as CANNON from 'cannon-es'

type ShapeCannon = "Convex" | "Sphere" | "Plane";
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
        switch (props.type) {
            case "Convex":
                cmesh = this.CreateConvexMesh(props.mesh);
                break;
            case "Sphere":
                console.log(props.mesh.scale.z);
                cmesh = new CANNON.Sphere(props.mesh.scale.z);
                break;
            case "Plane":
                cmesh = new CANNON.Plane();
                break;
        }




        let cbody = new CANNON.Body({ mass: props.mass ?? (props.mesh.userData.masa ?? 0), shape: cmesh, material: props.material, linearDamping: 0.4, angularDamping: 0.4, collisionResponse:true });

        cbody.position.copy(props.mesh.position);
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
        if (props.click) {
            this.click = props.click;
            main.addToClick(props.mesh.name, this);
        }
        main.addToRender('CannonItem-' + props.mesh.name, this);
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
    render() {
        if (this.cbody) {
            this.mesh.position.copy(this.cbody.position);
            this.mesh.quaternion.copy(this.cbody.quaternion);
        }
    }
}
