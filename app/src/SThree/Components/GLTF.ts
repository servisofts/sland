import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import * as THREE from "three";
export default class GLTF {
    main;
    constructor(main) {
        this.main = main;

    }

    parse(obj) {
        let main = this.main;
        return new Promise<any>((resolve, reject) => {
            this.getGltfLoader().parse(JSON.stringify(obj), '', (async (gltf) => {
                let scene: THREE.scene = gltf.scene;
                main.scene.add(gltf.scene);
                gltf.scene.traverse(function (model) {
                    if (model.isCamera) {
                        main.CAMERAS.push(model);
                    }
                    if (model.userData) {
                        Object.keys(model.userData).map((key) => {
                            switch (key) {
                                case 'receiveShadow':
                                    model.receiveShadow = true;
                                    break;
                                case 'castShadow':
                                    model.castShadow = true;
                                    break;
                                case 'defaultCamera':
                                    main.camera = model;
                                    break;
                            }
                        })
                    }
                    if (model.isLight) {
                        if (model.shadow) {
                            model.castShadow = true
                            let sca = 1;
                            model.shadow.mapSize.width = 512 * sca;
                            model.shadow.mapSize.height = 512 * sca;
                            // model.shadow.camera.near = 0.1; // default
                            // model.shadow.camera.far = 1000; // de
                        }
                    }
                });
                resolve(gltf);
            }).bind(this), undefined, function (error) {
                reject(error);
            })

        })

    }
    fetch(url) {
        return new Promise<any>((resolve, reject) => {
            fetch(url).then(response => response.json()).then(json => {
                return resolve(json);
            }).catch(error => {
                return reject(error);
            })
        });
    }
    getGltfLoader() {
        if (!this.main.gltfLoader) {
            this.main.gltfLoader = new GLTFLoader(this.main.loadingManager);
            var dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath('three/examples/js/libs/draco/');
            this.main.gltfLoader.setDRACOLoader(dracoLoader);
        }
        return this.main.gltfLoader;
    }
}