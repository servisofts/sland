import * as THREE from "three";
import * as CANNON from 'cannon-es'
import { Geometry, Face3 } from 'three/examples/jsm/deprecated/Geometry';

type POINT = {
    x: number,
    y: number,
    z: number
}
type TRIANGLE = {
    a: POINT,
    b: POINT,
    c: POINT
}
export default class HeightField {
    meshDebug;
    main;
    parent;
    mesh;
    scale;
    position;
    debug;
    constructor(parent, prop?: { debug?: boolean, scale?: any, position?: any }) {
        this.debug = prop.debug || false;
        this.main = parent.main;
        this.parent = parent;
        this.scale = prop.scale || new THREE.Vector3(1, 1, 1);
        this.position = prop.position || new THREE.Vector3(0, 0, 0);
    }
    /// HEIGHT MAP
    addHeightFieldHelper(shape) {
        var geometry = new Geometry();
        var v0 = new CANNON.Vec3();
        var v1 = new CANNON.Vec3();
        var v2 = new CANNON.Vec3();
        for (var xi = 0; xi < shape.data.length - 1; xi++) {
            for (var yi = 0; yi < shape.data[xi].length - 1; yi++) {
                for (var k = 0; k < 2; k++) {
                    shape.getConvexTrianglePillar(xi, yi, k === 0);
                    v0.copy(shape.pillarConvex.vertices[0]);
                    v1.copy(shape.pillarConvex.vertices[1]);
                    v2.copy(shape.pillarConvex.vertices[2]);
                    v0.vadd(shape.pillarOffset, v0);
                    v1.vadd(shape.pillarOffset, v1);
                    v2.vadd(shape.pillarOffset, v2);
                    geometry.vertices.push(
                        new THREE.Vector3(v0.x, v0.y, v0.z),
                        new THREE.Vector3(v1.x, v1.y, v1.z),
                        new THREE.Vector3(v2.x, v2.y, v2.z)
                    );
                    var i = geometry.vertices.length - 3;
                    geometry.faces.push(new Face3(i, i + 1, i + 2));
                }
            }
        }
        geometry.computeBoundingSphere();
        geometry.computeFaceNormals();
        this.parent.meshDebug = new THREE.Mesh(geometry.toBufferGeometry(), new THREE.MeshLambertMaterial({ color: 0xFF0000, opacity: 0.8, transparent: true }));
        this.parent.meshDebug.position.set(this.position.x, this.position.y, this.position.z);
        this.parent.meshDebug.quaternion.copy(this.mesh.quaternion);
        // this.meshDebug.receiveShadow = true;
        // this.meshDebug.castShadow = true;
        this.main.scene.add(this.parent.meshDebug);
    }
    CreateHeightfield(mesh) {
        this.mesh = mesh;
        var bbox = new THREE.Box3().setFromObject(mesh);
        var sizeX = bbox.max.x - bbox.min.x;
        var sizeY = bbox.max.y - bbox.min.y;
        var sizeZ = bbox.max.z - bbox.min.z;
        let resolution = (sizeX * sizeY) * 2;
        // let resolution = 10;
        let aspect = ((sizeX * sizeY) / sizeX) / resolution;

        var position = mesh.geometry.attributes.position.array;
        let geomFaces = mesh.geometry.index.array;
        var faces = []
        for (var i = 0; i < geomFaces.length; i += 3) {

            var face: any = {
                a: {
                    x: position[geomFaces[i] * 3] * this.scale.x,
                    y: position[geomFaces[i] * 3 + 1] * this.scale.y,
                    z: position[geomFaces[i] * 3 + 2] * this.scale.z
                },
                b: {
                    x: position[geomFaces[i + 1] * 3] * this.scale.x,
                    y: position[geomFaces[i + 1] * 3 + 1] * this.scale.y,
                    z: position[geomFaces[i + 1] * 3 + 2] * this.scale.z
                },
                c: {
                    x: position[geomFaces[i + 2] * 3] * this.scale.x,
                    y: position[geomFaces[i + 2] * 3 + 1] * this.scale.y,
                    z: position[geomFaces[i + 2] * 3 + 2] * this.scale.z
                }

            }
            let eq = this.calcularEcuacion(face);
            face.eq = eq;
            faces.push(face);
        }
        // console.log(faces);
        let v = 0.1;
        var matrix = [];
        let x, y;
        // matrix[0] = [];
        // matrix[1] = [];
        // for (x = 0; x < resolution; x++) {
        //     matrix[0][x] = 0;
        //     matrix[1][x] = 0;
        // }
        var lz = 0;
        for (var i = 0; i <= resolution + 4; i++) {
            if (!matrix[i]) matrix[i] = [];
            for (var j = 0; j <= resolution + 4; j++) {
                x = ((i + 0.1) * aspect);
                y = ((j + 0.1) * aspect);
                var isInner = null;

                // matrix[i][j] = 0;
                for (var k = 0; k < faces.length; k++) {
                    if (this.isInner(faces[k], { x: x, y: y, z: 0 })) {
                        isInner = faces[k];
                        break;
                    }
                }

                if (isInner) {
                    var z = this.getZ(isInner, { x: x, y: y });
                    z = (z) ;
                    // if (z > sizeZ) z = sizeZ;

                    if (i > 0 && j > 0) {
                        var p1 = matrix[i][j - 1];
                        var p2 = matrix[i - 1][j];
                        var p3 = matrix[i - 1][j - 1];
                        // z = (((p1 + p2 + p3 + z) / 4) + z) / 2;
                    }
                    matrix[i][j] = z;

                } else {
                    if (i > 0 && j > 0) {
                        var p1 = matrix[i][j - 1];
                        var p2 = matrix[i - 1][j];
                        var p3 = matrix[i - 1][j - 1];
                        var p4 = matrix[i - 1][j + 1];
                        matrix[i][j] = (p1 + p2 + p3 + p4) / 4;
                    }
                }
                // }

                // }
            }



        }
        // console.log(matrix);

        // console.log("aspect", aspect);
        // console.log("resolution", resolution);
        // Create the heightfield
        var hfShape = new CANNON.Heightfield(matrix, {
            elementSize: aspect
        });
        if (this.debug) {
            this.addHeightFieldHelper(hfShape);
        }
        return hfShape;
    }


    isInner(triangle: TRIANGLE, point: POINT) {
        let o1 = this.getProductoCruz(point, triangle.a, triangle.b);
        let o2 = this.getProductoCruz(point, triangle.b, triangle.c);
        let o3 = this.getProductoCruz(point, triangle.c, triangle.a);
        return (o1 && o2 && o3) || (!o1 && !o2 && !o3);
    }

    getProductoCruz(p1: POINT, p2: POINT, p3: POINT) {
        return (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x) > 0;
    }

    calcularEcuacion(triangle) {
        var AC = {
            x: triangle.c.x - triangle.a.x,
            y: triangle.c.y - triangle.a.y,
            z: triangle.c.z - triangle.a.z
        }
        // ----BH
        var BH = {
            x: triangle.a.x - triangle.b.x,
            y: triangle.a.y - triangle.b.y,
            z: triangle.a.z - triangle.b.z
        }
        //-- Producto Scalar;
        var PS = {
            x: AC.x * BH.x,
            xt: AC.x * AC.x,
            y: AC.y * BH.y,
            yt: AC.y * AC.y,
            z: AC.z * BH.z,
            zt: AC.z * AC.z,
        }
        var t = ((PS.x + PS.y + PS.z) * -1) / (PS.xt + PS.yt + PS.zt)

        var AF = {
            x: triangle.b.x,
            xr: (AC.x * t) + BH.x,
            y: triangle.b.y,
            yr: (AC.y * t) + BH.y,
            z: triangle.b.z,
            zr: (AC.z * t) + BH.z
        }
        return AF;
    }

    getZ(triangle, { x, y }) {
        var eq = triangle.eq;
        var r = (x - eq.x) / eq.xr

        var EQ2 = {
            x: x,
            y: (r * eq.yr) + eq.y,
            z: (r * eq.zr) + eq.z
        }
        var z = (y / EQ2.y) * EQ2.z;
        return z;

    }

}


