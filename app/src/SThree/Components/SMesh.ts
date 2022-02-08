// import SCannon from './SCannon';
import * as CANNON from 'cannon-es'
import * as THREE from "three";

import GLTF from "./GLTF";
import SSocket from "servisofts-socket";
export type SMeshType = {
    key: string,
}
export default class SMesh {
    main;
    mixer;
    animations;
    constructor(main, props: SMeshType) {
        this.main = main;
        let Instance = this;

        this.getGltf(SSocket.api.root + "mesh/" + props.key).then(gltf => {
            new GLTF(main).parse(gltf).then(gltf => {

            });
        })


        main.addToRender(props.key, this);
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
        // if (this.mixer) {
        //     this.mixer.update(this.main.DELTA);
        // }

    }
}
