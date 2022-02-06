import * as THREE from "three";
import * as CANNON from 'cannon-es'

export default class World {
    props = {
        gravity: { x: 0, y: 0, z: -9.82 },
        friction: 0.002, // default friction of the ground ( 0: no friction at all , 1: high friction )
        iterations: 10,
    }
    main;
    gui;
    keystate = {};
    constructor(main) {
        this.main = main;
        main.addToRender('World', this);
        main.world = new CANNON.World();
        main.world.gravity.set(this.props.gravity.x, this.props.gravity.y, this.props.gravity.z);
        main.world.defaultContactMaterial.friction = this.props.friction;
        main.world.broadphase = new CANNON.NaiveBroadphase();
        main.world.iterations = this.props.iterations;
        // main.demo = new THREE.CannonDebugRenderer(main.scene, main.world);
    }


    render() {
        if (this.main.world) {
            this.main.world.step(this.main.DELTA);
        }
    }
}
