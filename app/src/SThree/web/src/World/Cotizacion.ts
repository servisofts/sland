
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

import cotizacion from "../../../../Assets/3d/cotizacion.json";

import * as THREE from "three";
import HtmlObj from './HtmlObj';

export default class Blender {
    main;
    mixer;
    animations;
    constructor(main) {
        this.main = main;
        this.mixer = new THREE.AnimationMixer(main.scene);
        //INITIALIZE LOADERS
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
                    // main.camera.setFocalLength(45);
                    // main.camera.rotation.order = 'XZY';
                    // main.controls = new PointerLockControls(main.camera, document.body);

                }
                if (model.isLight) {

                    model.castShadow = true
                    if (model.shadow) {
                        // model.shadow.mapSize.width = window.innerWidth*2;
                        // model.shadow.mapSize.height = window.innerHeight*2;

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
                // console.log(gltf.animations[i]);
            }
            this.createPantallas(main);

        }).bind(this), undefined, function (error) {
            console.log(error.message);
            console.log(error.stack);
        });


        main.addToRender('Blender', this);
    }

    createPantallas(main) {
        main.sceneCotizacionPantalla1 = main.sceneCotizacion.getObjectByName("Pantalla_1");
        main.sceneCotizacionPantalla2 = main.sceneCotizacion.getObjectByName("Pantalla_2");
        main.sceneCotizacionPantalla3 = main.sceneCotizacion.getObjectByName("Pantalla_3");
        var material = new THREE.MeshBasicMaterial();
        material.color.set('black')
        material.opacity = 0;
        material.blending = THREE.NoBlending;
        main.sceneCotizacionPantalla1.material = material;
        main.sceneCotizacionPantalla2.material = material;
        main.sceneCotizacionPantalla3.material = material;
        var autoPlay = 0;
        var html1 = `<iframe width="100%" height="100%" src="https://kolping.servisofts.com" ></iframe>`;
        var html2 = `<iframe width="100%" height="100%" src="https://calistenia.servisofts.com"></iframe>`;
        var html3 = `<iframe width="100%" height="100%" src="https://fullparts.servisofts.com"></iframe>`;
        // var html3 = `<iframe width="100%" height="100%" src=""></iframe>`;
        // new HtmlObj(main, main.sceneCotizacionPantalla1, html1, { width: 411, height: 823 });
        new HtmlObj(main, main.sceneCotizacionPantalla2, html2, { width: 411, height: 823 });
        new HtmlObj(main, main.sceneCotizacionPantalla3, html3, { width: 411, height: 823 });

    }
    render() {
        if (this.mixer) {
            this.mixer.update(this.main.DELTA);
        }
    }
}
