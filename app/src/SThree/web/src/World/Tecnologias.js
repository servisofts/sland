
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import OBJETO from "../../../../Assets/3d/tecnologias.json";
import * as THREE from "three";
import Alert from '../Alert';

export default class Tecnologias {
    main;
    mixer;
    constructor(main) {
        this.main = main;
        this.mixer = new THREE.AnimationMixer(main.scene);
        this.mixer.addEventListener('finished', (e) => {
            switch (e.action.getClip().name) {
                case "cubo_in_ns":
                    Alert.open({
                        key: "Popup",
                        component: <h4 style={{ textAlign: "center", }}>Nuestros sistemas son creados para alcanzar las diferentes plataformas, Haciendo posible que nuestras applicaciones puedan ser utilizadas en Android, IOS y Web</h4>,
                        onClose: () => {
                            this.startAnimation("cubo_out_ns");

                        }
                    })
                    break;
                case "cubo_out_ns":
                    this.mixer.stopAllAction();
                    this.startAnimation("network_in_ns");
                    this.startAnimation("network_rotation_ns", true);
                    Alert.open({
                        key: "Popup",
                        component: <h4 style={{ textAlign: "center", }}>Que tecnologioas utilizamos?</h4>,
                        onClose: () => {
                            Alert.open({
                                key: "Popup",
                                component: <h4 style={{ textAlign: "center", }}>Tecnologias tecnologicas</h4>,
                                onClose: () => {
                                    // this.mixer.stopAllAction();
                                }
                            })
                            // this.mixer.stopAllAction();
                        }
                    })
                    break;
            }
        })
        // const gridHelper = new THREE.GridHelper(20, 20);
        // main.scene.add(gridHelper); 

        // const axesHelper = new THREE.AxesHelper(20);
        // main.scene.add(axesHelper);
        main.gltfLoader = new GLTFLoader(main.loadingManager);
        var dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('three/examples/js/libs/draco/');
        main.gltfLoader.setDRACOLoader(dracoLoader);
        main.gltfLoader.parse(JSON.stringify(OBJETO), '', (async (gltf) => {
            main.sceneFirstPerson = gltf.scene;
            main.scene.remove(main.sceneActual);
            main.scene.add(main.sceneFirstPerson);
            main.camera = main.sceneFirstPerson.getObjectByName("Camera");

            this.clipActions(gltf);
            Alert.open({
                key: "Popup",
                component: <h1 style={{ textAlign: "center", }}>Como creamos una app servisofts?</h1>,
                onClose: () => {
                    this.startAnimation("cubo_in_ns");
                }
            })
        }))
        main.addToRender('FirtsPerson', this);
    }
    startAnimation(name, repeat) {
        if (!repeat) {
            this.animations[name].setLoop(THREE.LoopOnce);
            this.animations[name].clampWhenFinished = true;
        }
        this.animations[name].play();
    }
    async clipActions(gltf) {
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
    }
    render() {
        if (this.mixer) {
            this.mixer.update(this.main.DELTA);
        }
    }
}
