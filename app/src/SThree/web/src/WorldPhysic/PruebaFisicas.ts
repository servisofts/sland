
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

import cotizacion from "../../../../Assets/3d/pruebaFisicas.json";

import * as THREE from "three";
import * as CANNON from 'cannon-es'
import SCannon from './SCannon';
import { SThread } from 'servisofts-component';

export default class PruebaFisicas {
    main;
    mixer;
    animations;
    constructor(main) {
        this.main = main;
        this.mixer = new THREE.AnimationMixer(main.scene);
        //INITIALIZE LOADERS

        // const gridHelper = new THREE.GridHelper(200, 200);
        // main.scene.add(gridHelper);

        // const axesHelper = new THREE.AxesHelper(1000);
        // main.scene.add(axesHelper);

        main.gltfLoader = new GLTFLoader(main.loadingManager);
        var dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('three/examples/js/libs/draco/');
        main.gltfLoader.setDRACOLoader(dracoLoader);
        main.gltfLoader.parse(JSON.stringify(cotizacion), '', (async (gltf) => {
            // gltf.scene.rotation.x -= Math.PI/2;
            main.sceneCotizacion = gltf.scene;
            main.sceneCotizacion.add(new THREE.AmbientLight(0xffffff, 0.23));

            main.scene.remove(main.sceneActual);
            main.scene.add(main.sceneCotizacion);
            // main.sceneCotizacion.rotation.x -= Math.PI/2;

            // main.camera = main.scene.getObjectByName("Camera");
            main.sceneActual = main.sceneCotizacion;
            gltf.scene.traverse(function (model) {
                if (model.isCamera) {
                    main.camera = model;
                }
                if (model.isLight) {

                    if (model.shadow) {
                        model.castShadow = true
                        model.shadow.mapSize.width = 2048;
                        model.shadow.mapSize.height = 2048;

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

    addPhysics(main) {


        main.world.broadphase = new CANNON.NaiveBroadphase();
        main.world.iterations = 10;


        const groundMaterial = new CANNON.Material("groundMaterial");
        var contact_material = new CANNON.ContactMaterial(groundMaterial, groundMaterial, {
            friction: 0.4,
            restitution: 0.5,
            // contactEquationStiffness: 1000,
            // contactEquationRelaxation: 3,
            // frictionEquationStiffness: 10000,

        });
        main.world.addContactMaterial(contact_material);


        new SCannon(main, {
            mesh: main.scene.getObjectByName("Cube"),
            type: "Convex",
            mass: 0,
            recibeShadow: true,
            material: groundMaterial,
        });
        new SCannon(main, {
            mesh: main.scene.getObjectByName("Cone"),
            type: "Convex",
            mass: 0,
            recibeShadow: true,
            castShadow: true,
            material: groundMaterial,
        });



        const sphere = new CANNON.Material("sphereMaterial");
        var contact_material2 = new CANNON.ContactMaterial(groundMaterial, sphere, {
            friction: 0.1,
            restitution: 0.1,
            // contactEquationRelaxation: 1000,
            // frictionEquationStiffness: 1e8,
        });
        main.world.addContactMaterial(contact_material2);
        var force = 100;

        new SThread(1000, "pelotas", true).start(() => {
            let item = new SCannon(main, {
                mesh: main.scene.getObjectByName("Sphere1"),
                type: "Sphere",
                // mass: 1,A
                material: sphere,
                castShadow: true,
                click: (int, evt) => {
                    var point = int[0].point;
                    var post = int[0].object.position;
                    var forc = new CANNON.Vec3((post.x - point.x) * force, (post.y - point.y) * force, (post.z - point.z));
                    var direction = new CANNON.Vec3(post.x - point.x, post.y - point.y, (post.z - point.z));
                    item.impulse(forc, direction);
                }
            })
            let item2 = new SCannon(main, {
                mesh: main.scene.getObjectByName("B2"),
                type: "Sphere",
                // mass: 1,A
                material: sphere,
                castShadow: true,
                click: (int, evt) => {
                    var point = int[0].point;
                    var post = int[0].object.position;
                    var forc = new CANNON.Vec3((post.x - point.x) * force, (post.y - point.y) * force, 0);
                    var direction = new CANNON.Vec3(post.x - point.x, post.y - point.y, (post.z - point.z));
                    item2.impulse(forc, direction);
                }
            })
            let item3 = new SCannon(main, {
                mesh: main.scene.getObjectByName("B3"),
                type: "Sphere",
                // mass: 1,A
                material: sphere,
                castShadow: true,
                click: (int, evt) => {
                    var point = int[0].point;
                    var post = int[0].object.position;
                    var forc = new CANNON.Vec3((post.x - point.x) * force, (post.y - point.y) * force, 0);
                    var direction = new CANNON.Vec3(post.x - point.x, post.y - point.y, (post.z - point.z));
                    item3.impulse(forc, direction);
                }
            })
            let item4 = new SCannon(main, {
                mesh: main.scene.getObjectByName("B4"),
                type: "Sphere",
                // mass: 1,A
                material: sphere,
                castShadow: true,
                click: (int, evt) => {
                    var point = int[0].point;
                    var post = int[0].object.position;
                    var forc = new CANNON.Vec3((post.x - point.x) * force, (post.y - point.y) * force, 0);
                    var direction = new CANNON.Vec3(post.x - point.x, post.y - point.y, (post.z - point.z));
                    item4.impulse(forc, direction);
                }
            })
            let item5 = new SCannon(main, {
                mesh: main.scene.getObjectByName("B5"),
                type: "Sphere",
                // mass: 1,A
                material: sphere,
                castShadow: true,
                click: (int, evt) => {
                    var point = int[0].point;
                    var post = int[0].object.position;
                    var forc = new CANNON.Vec3((post.x - point.x) * force, (post.y - point.y) * force, 0);
                    var direction = new CANNON.Vec3(post.x - point.x, post.y - point.y, (post.z - point.z));
                    item5.impulse(forc, direction);
                }
            })
        })

        // let item2 = new SCannon(main, {
        //     mesh: main.scene.getObjectByName("Sphere2"),
        //     type: "Sphere",
        //     mass: 1,
        //     material: sphere,
        //     castShadow: true,
        //     click: (int, evt) => {
        //         var point = int[0].point;
        //         var post = int[0].object.position;
        //         var forc = new CANNON.Vec3((post.x - point.x) * force, (post.y - point.y) * force, 0);
        //         var direction = new CANNON.Vec3(post.x - point.x, post.y - point.y, (post.z - point.z));
        //         item2.impulse(forc, direction);
        //     }
        // });

    }

    render() {

        if (this.mixer) {
            this.mixer.update(this.main.DELTA);
        }
        if (this.main.world) {
            this.main.world.step(this.main.DELTA);

        }

    }
}
