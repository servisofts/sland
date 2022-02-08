import React, { Component } from "react";
import * as THREE from "three";
import * as CANNON from 'cannon-es'

import Renderer from "../Components/Renderer";
import Camera from "../Components/Camera";
import Stats from "../Components/Stats";
import Helpers from "../Components/Helpers";
import SMesh from "../Components/SMesh";
type RendererProps = {
  width: number,
  height: number,
}

type AppProps = {
  renderer?: RendererProps,
  meshes: Array<{
    key: string,
  }>;
}
export default class App extends Component<AppProps> {


  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  clock: THREE.Clock;
  camera: THREE.PerspectiveCamera;

  ITEMS_TO_RENDER = {};
  CAMERAS = [];

  DELTA;

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
    // new Helpers(this);
    new Camera(this);
    this.props.meshes.map((mesh)=>{
      new SMesh(this, mesh);
    })
    this.renderer.setAnimationLoop(this.animate.bind(this));
  }

  addToRender(name, instance) {
    this.ITEMS_TO_RENDER[name] = instance;
  }

  animate() {
    this.DELTA = this.clock.getDelta();

    Object.keys(this.ITEMS_TO_RENDER).forEach(key => {
      this.ITEMS_TO_RENDER[key].render();
    })

    this.renderer.render(this.scene, this.camera);
    // this.cssRenderer.render(this.scene, this.camera);
  }

  render() {
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
