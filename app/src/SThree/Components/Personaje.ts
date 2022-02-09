
import GLTF from "./GLTF";
import cotizacion from "../../Assets/3d/personaje.json";

import * as THREE from "three";
import * as CANNON from 'cannon-es'
// import SCannon from './SCannon';
import { SThread } from 'servisofts-component';
import SCannon from "./SCannon";
import SSocket from "servisofts-socket";
export default class Personaje {
    main;
    mixer;
    animations = {};
    personaje;
    cmesh;
    mesh;
    COLLITION;
    OBJECT_IN_COLLITION = {};
    props = {
        velocity: 1,
        speedRun: 2,
        jumpForce: 2,
    }
    constructor(main) {
        this.main = main;
        this.mixer = new THREE.AnimationMixer(main.scene);
        new GLTF(main).parse(cotizacion).then(gltf => {
            this.personaje = main.scene.getObjectByName("Personaje");
            this.personaje.position.set(0, 0, 1);
            this.addAnimations(gltf);
            new SThread(1000, "initPhu", false).start(() => {
                this.addPhysics(main);
            });
        });

        main.addToRender('Personaje', this);
        document.addEventListener('keydown', this.onKeyDown.bind(this), false);
        document.addEventListener('keyup', this.onKeyUp.bind(this), false);
    }

    addPhysics(main) {
        this.mesh = main.scene.getObjectByName("Personaje");
        this.cmesh = new SCannon(main, {
            mesh: this.mesh,
            type: "Box",
            mass: 1,
        })

    }
    async addAnimations(gltf) {
        this.mixer.actions = [];
        this.animations = {};
        for (var i = 0; i < gltf.animations.length; i++) {
            var action = await this.mixer.clipAction(gltf.animations[i]);
            this.mixer.actions.push(action);
            this.animations[gltf.animations[i].name] = action;
            if (gltf.animations[i].name.indexOf("Salto") > -1) {
                action.setLoop(THREE.LoopOnce);
                action.clampWhenFinished = true;
            }
            // if (gltf.animations[i].name.indexOf("_ns") < 0) {
            // action.play();
            // }
        }
        if (this.animations["Descanso"]) {
            this.animations["Descanso"].play();
        }
    }

    keystate = {};
    isSalto = false;
    onKeyDown(evt) {
        this.keystate[evt.keyCode] = true;

        switch (evt.keyCode) {
            case 49: this.main.camera = this.main.CAMERAS[0] ?? this.main.camera; break;
            case 50: this.main.camera = this.main.CAMERAS[1] ?? this.main.camera; break;
            case 51: this.main.camera = this.main.CAMERAS[2] ?? this.main.camera; break;
            case 52: this.main.camera = this.main.CAMERAS[3] ?? this.main.camera; break;
            case 53: this.main.camera = this.main.CAMERAS[4] ?? this.main.camera; break;
            case 54: this.main.camera = this.main.CAMERAS[5] ?? this.main.camera; break;
            case 55: this.main.camera = this.main.CAMERAS[6] ?? this.main.camera; break;
            case 56: this.main.camera = this.main.CAMERAS[7] ?? this.main.camera; break;
            case 32:
                // if (Object.keys(this.OBJECT_IN_COLLITION).length > 0) {
                    // if (this.animations["Salto"]) {
                    //     this.animations["Salto"].reset();
                    //     this.animations["Salto"].play();
                    // }
                    // new SThread(1000, "jump", false).start(() => {
                        this.cmesh.velocity(0, 0, this.props.jumpForce);
                    // })
                // }
                break;
        }
    }
    onKeyUp(evt) {
        delete this.keystate[evt.keyCode];
    }

    lastRender = 0;
    checkCollition() {
        var delta = this.main.DELTA;
        this.lastRender += delta;
        if (this.lastRender < 1 / 10) {
            return;
        }

        if (this.mesh) {
            this.COLLITION = this.main.COLLITION.filter(c => c.name != this.mesh.name)
            this.lastRender = 0;
            var originPoint = this.mesh.position.clone();
            this.OBJECT_IN_COLLITION = {};
            for (var vertexIndex = 0; vertexIndex < this.mesh.geometry.attributes.position.array.length; vertexIndex++) {
                var localVertex = new THREE.Vector3().fromBufferAttribute(this.mesh.geometry.attributes.position, vertexIndex).clone();
                var globalVertex = localVertex.applyMatrix4(this.mesh.matrix);
                var directionVector = globalVertex.sub(this.mesh.position);
                var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
                var collisionResults = ray.intersectObjects(this.COLLITION);
                if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
                    this.OBJECT_IN_COLLITION[collisionResults[0].object.name] = collisionResults[0].object;
                }
            }
        }
    }
    notifyServer() {
        SSocket.send({
            component: "",
            type: "",
            estado: "",
            data: {

            }
        });
    }
    render() {
        var delta = this.main.DELTA;
        if (this.mixer) {
            this.mixer.update(this.main.DELTA);
        }
        // this.notifyServer();
        var speed = 1;
        if (this.keystate[16]) {
            speed = this.props.speedRun;
        }

        // if (this.keystate[32]) {
        // this.personaje.rotation.z += 0.2;
        // }
        if (this.keystate[81]) {
            this.cmesh.rotate(this.props.velocity * delta * speed);
            // this.personaje.rotation.z += 0.2;
        }
        if (this.keystate[69]) {
            this.cmesh.rotate(-this.props.velocity * delta * speed);
        }
        if (this.keystate[38] || this.keystate[87]) {
            if (this.animations["Caminar"]) {
                this.animations["Caminar"].play();
            }
            this.cmesh.translateX(-this.props.velocity * delta * speed);
        } else
            if (this.keystate[40] || this.keystate[83]) {
                // this.cmesh.velocity(1, 0, 0);
                this.cmesh.translateX(this.props.velocity * delta * speed);
                if (this.animations["Caminar"]) {
                    this.animations["Caminar"].play();
                }

            } else {
                if (this.animations["Caminar"]) {
                    this.animations["Caminar"].stop();
                }
            }
        if (this.keystate[37] || this.keystate[65]) {
            // this.cmesh.velocity(0, -1, 0);
            this.cmesh.translateY(-this.props.velocity * delta * speed);
        }
        if (this.keystate[39] || this.keystate[68]) {
            // this.cmesh.velocity(0, 1, 0);
            this.cmesh.translateY(this.props.velocity * delta * speed);
        }

        this.checkCollition();


    }
}
