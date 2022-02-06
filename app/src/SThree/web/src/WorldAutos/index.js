import React, { Component } from "react";
import * as THREE from "three";

import Camera from "./Camera";
import Helpers from "./Helpers";
import Renderer from "./Renderer";
import Stats from "./Stats";
import LoadingWindow from "./LoadingWindow";
import World from "./World";
import RayCaster from "./RayCaster";

import WorldAutos from "./gltf/WorldAutos";
import Personaje from "./gltf/Personaje";
import SCannon from "./SCannon";

export default class index extends Component {
    ITEMS_TO_RENDER = {};
    COLLITION = [];
    CAMERAS = [];
    componentDidMount() {
        new Renderer(this);
        LoadingWindow.getLoadingManager(this);
        this.scene = new THREE.Scene();
      
        // this.scene.add(new THREE.AmbientLight(0xffffff, 21));
        new Camera(this);

        // --- FOR DEBUGGING ---
        new Stats(this); // ---> FPS Counter for debugging/testing
        // new Helpers(this); // ---> Grid and Axes for debugging/testing

        // --- FOR PRODUCTION ---
        new RayCaster(this);
        new World(this); // ---> For the world physics with cannon.js

        new WorldAutos(this);
        new Personaje(this);

        // START
        this.renderer.setAnimationLoop(this.animate.bind(this));
    }

    addToRender(name, instance) {
        this.ITEMS_TO_RENDER[name] = instance;
    }
    animate() {
        this.DELTA = this.clock.getDelta();
        Object.keys(this.ITEMS_TO_RENDER).map(key => {
            if (this.ITEMS_TO_RENDER[key].render) {
                this.ITEMS_TO_RENDER[key].render();
            }
        })
        this.renderer.render(this.scene, this.camera);
        this.cssRenderer.render(this.scene, this.camera);
    }

    render() {
        return <>
            <div id="three" />
            <LoadingWindow />
        </>
    }
}
