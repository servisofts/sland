import React, { Component } from "react";
import * as THREE from "three";
import * as CANNON from 'cannon-es'

import Camera from "./Camera";
import Helpers from "./Helpers";
import Renderer from "./Renderer";
import Stats from "./Stats";
import Laberinto from "./Laberinto";
import Personaje from "./Personaje";

export default class index extends Component {
    ITEMS_TO_RENDER = {};
    ITEMS_TO_RAYCASTER = {};
    CAMERAS = [];
    COLLITION = [];
    componentDidMount() {

        new Renderer(this);
        this.loadingManager = new THREE.LoadingManager();
        this.loadingManager.onProgress = function (item, loaded, total) {
            document.getElementById("loadingWindow").style.visibility = "visible";
            console.log(loaded, total);
        };
        this.loadingManager.onLoad = function () {
            document.getElementById("loadingWindow").style.visibility = "hidden";
            console.log("loaded all resources");
        };

        this.raycaster = new THREE.Raycaster();

        this.renderer.domElement.addEventListener('click', (event) => this.onClick(event), false);


        this.scene = new THREE.Scene();
        this.sceneActual = new THREE.Scene();
        this.scene.add(this.sceneActual);

        this.world = new CANNON.World();
        this.world.gravity.set(0, 0, -9.82);
        this.world.defaultContactMaterial.friction = 1;
        this.world.broadphase = new CANNON.NaiveBroadphase();
        this.world.iterations = 10;

        this.scene.add(new THREE.AmbientLight(0xffffff, 1));

        new Stats(this);
        new Camera(this);
        // new Helpers(this);
        new Laberinto(this);
        new Personaje(this);
        this.renderer.setAnimationLoop(this.animate.bind(this));
    }

    onClick(event) {
        const mouse = {
            x: (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1,
            y: -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1,
        }

        this.raycaster.setFromCamera(mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children)

        // if (intersects.length > 0) {
        //     var letrero = intersects.filter(o => o.object.name.includes("letrero"));
        //     if (letrero.length > 0) {
        //         new Cotizacion(this);
        //     }
        //     var loby = intersects.filter(o => o.object.name.includes("loby"));
        //     if (loby.length > 0) {
        //         new Blender(this);
        //     }
        // }

        Object.keys(this.ITEMS_TO_RAYCASTER).forEach(key => {
            var items = intersects.filter(o => o.object.name.includes(key));
            if (items.length > 0) {
                if (this.ITEMS_TO_RAYCASTER[key].click) {
                    this.ITEMS_TO_RAYCASTER[key].click(items, event);
                }
            }

        })
    }

    addToRender(name, instance) {
        this.ITEMS_TO_RENDER[name] = instance;
    }
    addToClick(name, instance) {
        this.ITEMS_TO_RAYCASTER[name] = instance;
    }

    animate() {
        this.DELTA = this.clock.getDelta();
        if (this.world) {
            this.world.step(this.DELTA);
        }
        Object.keys(this.ITEMS_TO_RENDER).forEach(key => {
            this.ITEMS_TO_RENDER[key].render();
        })

        this.renderer.render(this.scene, this.camera);
        this.cssRenderer.render(this.scene, this.camera);
    }

    render() {
        return <><div id="three" />
            <div
                id="loadingWindow"
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "#000",
                    visibility: "visible",
                }}></div>
        </>
    }
}
