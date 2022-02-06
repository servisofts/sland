import * as THREE from "three";
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

export default class Renderer {
    main;

    resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const pixelRatio = window.devicePixelRatio;
        const width = canvas.clientWidth * pixelRatio | 0;
        const height = canvas.clientHeight * pixelRatio | 0;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setPixelRatio(0.8);
            renderer.setSize(width, height, false);
        }
        return needResize;
    }
    constructor(main) {
        this.main = main;
        main.clock = new THREE.Clock();
        main.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        main.cssRenderer = new CSS3DRenderer();

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i.test(navigator.userAgent)) {
            this.resizeRendererToDisplaySize(main.renderer);
        } else {
            // main.renderer.setPixelRatio(window.devicePixelRatio);
            main.renderer.setPixelRatio(0.8);
        }

        main.renderer.setSize(window.innerWidth, window.innerHeight);
        main.cssRenderer.setSize(window.innerWidth, window.innerHeight);

        main.renderer.outputEnconding = THREE.sRGBEncoding;
        main.renderer.setClearColor(0x000000);

        main.renderer.domElement.style.position = 'absolute';
        //main.renderer.domElement.style.pointerEvents = 'none';
        main.cssRenderer.domElement.style.position = 'absolute';

        main.renderer.domElement.style.top = 0;
        main.cssRenderer.domElement.style.top = 0;


        main.renderer.physicallyCorrectLights = true;
        main.renderer.shadowMap.enabled = true;
        main.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        main.renderer.shadowMap.renderReverseSided = false;


        main.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        main.renderer.toneMappingExposure = 0.75;



        main.renderer.domElement.zIndex = 1;

        document.getElementById("three").appendChild(main.cssRenderer.domElement);
        document.getElementById("three").appendChild(main.renderer.domElement);

        main.addToRender('Renderer', this);
    }

    resizeCanvasToDisplaySize() {
        // this.main.renderer.setSize(window.innerWidth, window.innerHeight);
        const canvas = this.main.renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        // const width = window.innerWidth;
        // const height = window.innerHeight;
        this.main.renderer.setSize(width, height, false);
        this.main.cssRenderer.setSize(width, height);
        this.main.camera.aspect = width / height;
        this.main.camera.updateProjectionMatrix();
    }
    render() {
        this.resizeCanvasToDisplaySize();
    }
}
