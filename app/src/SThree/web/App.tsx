import React, { Component } from "react";
import * as THREE from "three";
import * as CANNON from 'cannon-es'

import Renderer from "../Components/Renderer";
import Camera from "../Components/Camera";
import Stats from "../Components/Stats";
import Helpers from "../Components/Helpers";
import SMesh, { SMeshType } from "../Components/SMesh";
import Personaje from "../Components/Personaje";
import SCannon from "../Components/SCannon";

type RendererProps = {
  width: number,
  height: number,
}

export type AppProps = {
  renderer?: RendererProps,
  meshes: Array<SMeshType>;
}
export default class App extends Component<AppProps> {


  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  clock: THREE.Clock;
  camera: THREE.PerspectiveCamera;

  ITEMS_TO_RENDER = {};
  CAMERAS = [];
  COLLITION = [];
  MESHES;

  DELTA;
  world;
  props: AppProps;
  constructor(props) {
    super(props);

  }

  componentDidMount() {
    new Renderer(this);
    this.scene = new THREE.Scene();
    this.scene.add(this.scene);
    this.scene.add(new THREE.AmbientLight(0xffffff, 1));
    new Stats(this);
    this.world = new CANNON.World();
    this.world.gravity.set(0, 0, -9.82);
    this.world.defaultContactMaterial.friction = 1;
    this.world.broadphase = new CANNON.NaiveBroadphase();
    this.world.iterations = 10;
    new Camera(this);
    // new Helpers(this);
    this.MESHES = {};

    new Personaje(this);

    this.renderer.setAnimationLoop(this.animate.bind(this));
  }

  addToRender(name, instance) {
    this.ITEMS_TO_RENDER[name] = instance;
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
    // this.cssRenderer.render(this.scene, this.camera);
  }

  render() {
    console.log(this.props);
    if (this.MESHES) {
      this.props.meshes.map((mesh) => {
        if (!this.MESHES[mesh.key]) {
          this.MESHES[mesh.key] = new SMesh(this, mesh);
        } else {
          this.MESHES[mesh.key].update(mesh);
        }
      })
    }
    return <><div id="three" />
      {/* <div
        id="loadingWindow"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "#000",
          visibility: "hidden",
        }}></div> */}
    </>
  }
}
