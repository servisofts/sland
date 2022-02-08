import * as THREE from "three";

export default class Helpers {
    props = {

    }
    main;
    constructor(main) {
        this.main = main;
        
        const gridHelper = new THREE.GridHelper(20, 20);
        main.scene.add(gridHelper); 

        const axesHelper = new THREE.AxesHelper(20);
        main.scene.add(axesHelper);
    }

}
