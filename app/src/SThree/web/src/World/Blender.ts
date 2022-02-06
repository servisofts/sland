
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

import PRUEBA1 from "../../../../Assets/3d/prueba1.json";
import * as THREE from "three";
import HtmlObj from './HtmlObj';

export default class Blender {
    main;
    mixer;
    constructor(main) {
        this.main = main;
        this.mixer = new THREE.AnimationMixer(main.scene);

        //INITIALIZE LOADERS
        main.gltfLoader = new GLTFLoader(main.loadingManager);
        var dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('three/examples/js/libs/draco/');
        main.gltfLoader.setDRACOLoader(dracoLoader);
        main.gltfLoader.parse(JSON.stringify(PRUEBA1), '', (async (gltf) => {
            main.sceneBlender = gltf.scene;
            main.scene.remove(main.sceneActual);
            main.scene.add(main.sceneBlender);
            main.sceneActual = main.sceneBlender;
            main.camera = main.sceneBlender.getObjectByName("Camera");

            // main.test.rotation.x = -Math.PI/2;
            // main.scene.add(main.test);
            // main.light = main.scene.getObjectByName("Point").children[0];
            // main.light.castShadow = true;
            // main.light = main.scene.getObjectByName("Point1").children[0];
            // main.light.castShadow = true;
            // main.light = main.scene.getObjectByName("Point2").children[0];
            // main.light.castShadow = true; 


            gltf.scene.traverse(function (model) {
                if (model.isLight) {
                    model.castShadow = true
                    // model.intensity = model.intensity;
                    model.power = model.power*0.5;
                };
                if (model.isMesh && model.name.includes("_cs")) {
                    model.castShadow = true;
                }
                if (model.isMesh && model.name.includes("_rs")) {
                    model.receiveShadow = true;
                }
            });

            this.mixer.actions = [];
            for (var i = 0; i < gltf.animations.length; i++) {
                var action = await this.mixer.clipAction(gltf.animations[i]);
                // this.mixer.actions[gltf.animations[i].name] = action;
                this.mixer.actions.push(action);
                action.play();
            }

            main.sceneBlenderPantalla = main.sceneBlender.getObjectByName("Pantalla2");

            var material = new THREE.MeshBasicMaterial();
            material.color.set('black')
            material.opacity = 0;
            material.blending = THREE.NoBlending;
            main.sceneBlenderPantalla.material = material;
            var html = `
            <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/lDK9QqIzhwk?autoplay=1" 
                title="YouTube video player" 
                frameborder="0" 
                allow="autoplay;" 
                allowfullscreen>
            </iframe>`;
            // var html = `
            // <iframe 
            //     width="100%" 
            //     height="100%" 
            //     src="https://kolping.servisofts.com/" 
            //     >
            // </iframe>`;

            new HtmlObj(main, main.sceneBlenderPantalla, html, { width:1024, height:768 });

            // cssObject.rotation.rotation.x = main.pantalla.rotation.x;
            // cssObject.rotation.rotation.y = main.pantalla.rotation.y;
            // cssObject.rotation.rotation.z = main.pantalla.rotation.z;



            // this.mixers.push(this.mixer);

            // this.mixer[0].setLoop(THREE.LoopOnce);
            // this.mixer[0].clampWhenFinished = true;
            // INSTANCE.mixer.actions[0].play();
            // main.piso = main.scene.getObjectByName("Piso");
            // main.piso.receiveShadow = true;
            // main.piso.castShadowq = true;

        }).bind(this), undefined, function (error) {
            console.log(error.message);
            console.log(error.stack);   
        });


        main.addToRender('Blender', this);
    }

    render() {
        if (this.mixer) {
            this.mixer.update(this.main.DELTA);
        }
    }
}
