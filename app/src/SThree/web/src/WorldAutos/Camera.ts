import * as THREE from "three";
import { GUI } from 'dat.gui'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

export default class Camera {
    props = {
        far: 1000,
        near: 0.1,
        fov: 45,
        position: {
            x: 8,
            y: 0.2,
            z: 5
        },
        lookAt: { x: 0, y: 0.2, z: 0 },
    }

    main;
    gui: GUI;
    constructor(main) {
        this.main = main;
        main.camera = new THREE.PerspectiveCamera(this.props.fov, window.innerWidth / window.innerHeight, this.props.near, this.props.far);
        main.camera.position.set(this.props.position.x, this.props.position.y, this.props.position.z);
        if (this.props.lookAt) {
            main.camera.lookAt(this.props.lookAt.x, this.props.lookAt.y, this.props.lookAt.z);
        }
        main.CAMERAS.push(main.camera);

        document.addEventListener('keydown', this.onKeyDown.bind(this), false);
        // this.createGUIControls();
    }
    onKeyDown(evt) {
        switch (evt.keyCode) {
            case 49: this.main.camera = this.main.CAMERAS[0] ?? this.main.camera; break;
            case 50: this.main.camera = this.main.CAMERAS[1] ?? this.main.camera; break;
            case 51: this.main.camera = this.main.CAMERAS[2] ?? this.main.camera; break;
            case 52: this.main.camera = this.main.CAMERAS[3] ?? this.main.camera; break;
            case 53: this.main.camera = this.main.CAMERAS[4] ?? this.main.camera; break;
            case 54: this.main.camera = this.main.CAMERAS[5] ?? this.main.camera; break;
            case 55: this.main.camera = this.main.CAMERAS[6] ?? this.main.camera; break;
            case 56: this.main.camera = this.main.CAMERAS[7] ?? this.main.camera; break;
        }
    }
    createGUIControls() {
        this.gui = new GUI()
        const cameraFolder = this.gui.addFolder('Camera Position')
        cameraFolder.add(this.main.camera.position, 'x', -10, 10)
        cameraFolder.add(this.main.camera.position, 'y', -10, 10)
        cameraFolder.add(this.main.camera.position, 'z', -10, 10)
        cameraFolder.open()
        const cameraRotationFolder = this.gui.addFolder('Camera Rotation')
        cameraRotationFolder.add(this.main.camera.rotation, 'x', Math.PI * -1, Math.PI * 1)
        cameraRotationFolder.add(this.main.camera.rotation, 'y', Math.PI * -1, Math.PI * 1)
        cameraRotationFolder.add(this.main.camera.rotation, 'z', Math.PI * -1, Math.PI * 1)
        cameraRotationFolder.open()
    }

    render() {

    }
}
