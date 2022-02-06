
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

import cotizacion from "../../../../Assets/3d/pruebaFisicas.json";

import * as THREE from "three";
import * as CANNON from 'cannon-es'

export default class PruebaFisicas {
    main;
    mixer;
    animations;
    constructor(main) {
        this.main = main;
        this.mixer = new THREE.AnimationMixer(main.scene);
        //INITIALIZE LOADERS
        this.main.world = new CANNON.World();
        this.main.world.gravity.set(0, 0, -9.82);

        main.gltfLoader = new GLTFLoader(main.loadingManager);
        var dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('three/examples/js/libs/draco/');
        main.gltfLoader.setDRACOLoader(dracoLoader);
        main.gltfLoader.parse(JSON.stringify(cotizacion), '', (async (gltf) => {
            // main.scene.rotation.x = Math.PI/2;
            main.sceneCotizacion = gltf.scene;
            main.sceneCotizacion.add(new THREE.AmbientLight(0xffffff, 0.32));
            main.scene.remove(main.sceneActual);
            main.scene.add(main.sceneCotizacion);
            main.sceneActual = main.sceneCotizacion;
            gltf.scene.traverse(function (model) {
                if (model.isCamera) {
                    main.camera = model;
                }
                if (model.isLight) {

                    if (model.shadow) {
                        model.castShadow = true

                    }
                };

                if (model.name.includes("_cs")) {
                    model.castShadow = true;
                }
                if (model.name.includes("_rs")) {
                    model.receiveShadow = true;
                }
            });
            this.mixer.actions = [];
            this.animations = {};
            for (var i = 0; i < gltf.animations.length; i++) {
                var action = await this.mixer.clipAction(gltf.animations[i]);
                this.mixer.actions.push(action);
                this.animations[gltf.animations[i].name] = action;
                if (gltf.animations[i].name.indexOf("_nr") > -1) {
                    action.setLoop(THREE.LoopOnce);
                    action.clampWhenFinished = true;
                }
                if (gltf.animations[i].name.indexOf("_ns") < 0) {
                    action.play();
                }
            }
            try {
                this.addPhysics(main);

            } catch (e) {
                console.log(e);
            }

        }).bind(this), undefined, function (error) {
            console.log(error.message);
            console.log(error.stack);
        });


        main.addToRender('PruebaFisicas', this);
    }

    CreateTrimesh(geometry: THREE.BufferGeometry) {
        const vertices = geometry.attributes.position.array
        const indices = Object.keys(vertices).map(Number)
        return new CANNON.Trimesh(vertices, indices)
    }

    addPhysics(main) {

        main.pelota = main.scene.getObjectByName("Sphere");
        main.pelota.castShadow = true;
        // main.pelotaBody = new CANNON.Body({ mass: 1 });
        // main.pelotaBody.addShape(this.CreateTrimesh(main.pelota.geometry));
        // main.pelotaBody.position.set(main.pelota.position.x, main.pelota.position.y, main.pelota.position.z);
        // main.world.addBody(main.pelotaBody);
        const position = main.pelota.geometry.attributes.position.array
        const icosahedronPoints= []
        for (let i = 0; i < position.length; i += 3) {
            icosahedronPoints.push(
                new CANNON.Vec3(position[i], position[i + 1], position[i + 2])
            )
        }
        const icosahedronFaces = []
        for (let i = 0; i < position.length / 3; i += 3) {
            icosahedronFaces.push([i, i + 1, i + 2])
        }
        const icosahedronShape = new CANNON.ConvexPolyhedron({
            vertices: icosahedronPoints,
            // faces: icosahedronFaces,
        })
        main.pelotaBody = new CANNON.Body({ mass: 1 })
        main.pelotaBody.addShape(icosahedronShape)
        main.pelotaBody.position.x = main.pelota.position.x
        main.pelotaBody.position.y = main.pelota.position.y
        main.pelotaBody.position.z = main.pelota.position.z
        main.world.addBody(main.pelotaBody)




        main.plane = main.scene.getObjectByName("Plane");
        main.plane.receiveShadow = true;
        const planeShape = new CANNON.Plane();
        
        main.planeBody = new CANNON.Body({ mass: 0 });
        main.planeBody.addShape(planeShape);
        // main.planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        // main.planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1.4, 0, 0), );
        main.planeBody.position.set(main.plane.position.x, main.plane.position.y, main.plane.position.z);
        main.planeBody.quaternion.copy(main.plane.quaternion);
        main.world.addBody(main.planeBody);
        // console.log(geometry);
    }

    render() {

        if (this.mixer) {
            this.mixer.update(this.main.DELTA);
        }
        if (this.main.world) {
            this.main.world.step(this.main.DELTA);
        }

        if (this.main.pelotaBody) {
            this.main.pelota.position.copy(this.main.pelotaBody.position);
            this.main.pelota.quaternion.copy(this.main.pelotaBody.quaternion);
        }
    }
}
