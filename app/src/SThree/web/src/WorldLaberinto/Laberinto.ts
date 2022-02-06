
import cotizacion from "../../../../Assets/3d/laberinto.json";
import SCannon from './SCannon';
import * as CANNON from 'cannon-es'

import * as THREE from "three";

import GLTF from "./GLTF";

export default class Labaerinto {
    main;
    mixer;
    animations;
    constructor(main) {
        this.main = main;

        // this.mixer = new THREE.AnimationMixer(main.scene);
        let Instance = this;
        new GLTF(main).parse(cotizacion).then(gltf => {
            // this.addPhysics(main);
            gltf.scene.traverse(function (model) {
                if (model.userData) {
                    Object.keys(model.userData).map((key) => {
                        switch (key) {
                            case 'mass':
                                Instance.addPhysics(model, 0);
                                break;
                        }
                    })
                }
            })
        });
        main.addToRender('Labaerinto', this);
    }
    addPhysics(mesh, mass) {
        // const groundMaterial = new CANNON.Material("groundMaterial");
        // var contact_material = new CANNON.ContactMaterial(groundMaterial, groundMaterial, {
        //     friction: 0.4,
        //     restitution: 0.5,
        //     // contactEquationStiffness: 1000,
        //     // contactEquationRelaxation: 3,
        //     // frictionEquationStiffness: 10000,
        // });
        // this.main.world.addContactMaterial(contact_material);
        new SCannon(this.main, {
            mesh: mesh,
            type: "Box",
            mass: mass,
            // material: groundMaterial,
        });

    }


    render() {
        // if (this.mixer) {
        //     this.mixer.update(this.main.DELTA);
        // }

    }
}
