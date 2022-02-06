import * as THREE from "three";
import { GUI } from 'dat.gui'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

export default class RayCaster {
    props = {

    }

    ITEMS_TO_RAYCASTER = {};

    main;
    constructor(main) {
        this.main = main;
        this.main.raycaster = new THREE.Raycaster();
        this.main.renderer.domElement.addEventListener('click', (event) => this.onClick(event), false);
        this.main.addToClick = (name, instance) => {
            this.ITEMS_TO_RAYCASTER[name] = instance;
        }
    }

    onClick(event) {
        const mouse = {
            x: (event.clientX / this.main.renderer.domElement.clientWidth) * 2 - 1,
            y: -(event.clientY / this.main.renderer.domElement.clientHeight) * 2 + 1,
        }
        this.main.raycaster.setFromCamera(mouse, this.main.camera);
        const intersects = this.main.raycaster.intersectObjects(this.main.scene.children)
        Object.keys(this.ITEMS_TO_RAYCASTER).forEach(key => {
            var items = intersects.filter(o => o.object.name.includes(key));
            if (items.length > 0) {
                if (this.ITEMS_TO_RAYCASTER[key].click) {
                    this.ITEMS_TO_RAYCASTER[key].click(items, event);
                }
            }
        })
    }
}
