// import SCannon from './SCannon';
import * as CANNON from 'cannon-es'
import * as THREE from "three";

import GLTF from "./GLTF";
import SSocket from "servisofts-socket";
import SCannon from './SCannon';
export type SMeshType = {
    key: string,
    key_mesh: string,
    position?: { x: number, y: number, z: number },
    rotation?: { x: number, y: number, z: number },
    scale?: { x: number, y: number, z: number },
}

export default class SMesh {
    main;
    mixer;
    animations;
    mesh;
    props;
    constructor(main, props: SMeshType, onLoad?) {
        this.props = props;
        this.main = main;
        let Instance = this;

        this.getGltf(SSocket.api.root + "mesh/" + props.key_mesh).then(gltf => {
            new GLTF(main).parse(gltf).then(gltf => {
                Instance.mesh = gltf.scene;
                if (onLoad) onLoad(gltf);
                gltf.scene.traverse(function (model) {
                    if (model.userData) {
                        Object.keys(model.userData).map((key) => {
                            switch (key) {
                                case 'mass':
                                    var type: any = "Box";
                                    if (model.userData["pType"]) {
                                        type = model.userData["pType"];
                                    }
                                    new SCannon(Instance.main, {
                                        mesh: model,
                                        type: type,
                                        mass: model.userData[key],
                                    });
                                    break;
                            }
                        })
                    }
                })
            });

        })
        main.addToRender(props.key, this);
    }
    update(props: SMeshType) {
        this.props = props;
    }

    getGltf(url) {
        return new Promise<any>((resolve, reject) => {
            fetch(url).then(response => response.json()).then(json => {
                return resolve(json);
            }).catch(error => {
                return reject(error);
            })
        });
    }

    render() {
        if (this.mixer) {
            this.mixer.update(this.main.DELTA);
        }
        if (this.mesh) {
            if (this.props.position) this.mesh.position.set(this.props.position.x, this.props.position.y, this.props.position.z);
            if (this.props.rotation) this.mesh.rotation.set(this.props.rotation.x, this.props.rotation.y, this.props.rotation.z);
            if (this.props.scale) this.mesh.scale.set(this.props.scale.x, this.props.scale.y, this.props.scale.z);
        }

    }
}
