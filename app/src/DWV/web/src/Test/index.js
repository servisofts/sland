
import React, { Component } from "react";
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import Stats from 'three/examples/jsm/libs/stats.module'
import Blender from "./Blender";

class Test extends Component {
    createRender() {
        this.clock = new THREE.Clock();
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.outputEnconding = THREE.sRGBEncoding;
        this.renderer.setClearColor(0x000000)

        this.renderer.physicallyCorrectLights = true;
        this.renderer.shadowMap.enabled = true;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.3;
        document.getElementById("three").appendChild(this.renderer.domElement);

    }
    createCamera() {
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    }
    createStats() {
        const INSTANCE = this;
        INSTANCE.stats = new Stats();
        INSTANCE.stats.setMode(0);
        INSTANCE.stats.domElement.style.position = 'absolute';
        INSTANCE.stats.domElement.style.left = '0';
        INSTANCE.stats.domElement.style.top = '0';
        document.body.appendChild(INSTANCE.stats.dom)
    }

    resizeCanvasToDisplaySize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        const canvas = this.renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        this.renderer.setSize(width, height, false);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }
    onClick(event) {
        const INSTANCE = this;
        const mouse = {
            x: (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1,
            y: -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1,
        }
        if(INSTANCE.mixer.actual === "t_front_back"){
            this.moverse("t_back_menu");
        }else{
            this.moverse("t_front_back");
        }

        this.raycaster.setFromCamera(mouse, this.camera);
        const intersects = INSTANCE.raycaster.intersectObjects(INSTANCE.scene.children)

        if (intersects.length > 0) {
            var guitarra = intersects.filter(o => o.object.name.includes("Guitarra"));
            console.log(guitarra)

        }
    }

    moverse(name){
        const INSTANCE = this;
        if(INSTANCE.mixer.actions[name]){
            if(INSTANCE.mixer.actual){
                INSTANCE.mixer.actions[INSTANCE.mixer.actual].fadeOut(0.2);
            }
            INSTANCE.mixer.actual = name;
            INSTANCE.mixer.actions[name].setLoop(INSTANCE.LoopOnce);
            INSTANCE.mixer.actions[name].clampWhenFinished = true;
            INSTANCE.mixer.actions[name].reset()
            INSTANCE.mixer.actions[name].fadeIn(0.2)
            INSTANCE.mixer.actions[name].play();
        }
    }

    componentDidMount() {
        this.createRender();
        this.scene = new THREE.Scene();
        this.createCamera();

        this.gltfLoader = new GLTFLoader();
        var dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('three/examples/js/libs/draco/');
        this.gltfLoader.setDRACOLoader(dracoLoader);

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.renderer.domElement.addEventListener('click', (event) => this.onClick(event), false)


        // var light = new THREE.AmbientLight(0xffffff, 1.5);
        // this.scene.add(light);
        // const gridHelper = new THREE.GridHelper(200, 200);
        // this.scene.add(gridHelper);
        // const gridHelper2 = new THREE.GridHelper(200, 200);
        // gridHelper2.rotation.x = Math.PI / 2;
        // this.scene.add(gridHelper2);

        // const axesHelper = new THREE.AxesHelper(100);
        // this.scene.add(axesHelper);
        this.LoopOnce = THREE.LoopOnce;
        this.mixer = new THREE.AnimationMixer(this.scene);
        this.mixers = [];
        // this.createTest();
        this.blender = new Blender(this);

        


        // const geometry = new THREE.BoxGeometry(5, 5, 5);
        // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        // const cube = new THREE.Mesh(geometry, material);
        // this.scene.add(cube);

        this.createStats();


        // ----RENDER----
        const animate = () => {

            this.resizeCanvasToDisplaySize();
            this.mixers.forEach((mixer) => {
                mixer.update(this.clock.getDelta());
            });
            this.blender.render();
            this.renderer.render(this.scene, this.camera);
            this.stats.update();
        }
        this.animate = animate;
        this.renderer.setAnimationLoop(animate);
    }
    render() {
        return (
            <div id="three" />
        )
    }
}
export default Test;