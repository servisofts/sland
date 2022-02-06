import * as THREE from "three";
import React from "react";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { act } from "react-dom/test-utils";
//import React3 from "react-three-renderer";
//import ObjectModel from 'react-three-renderer-objects';
class Logo extends React.Component {
  componentDidMount() {
    // === THREE.JS CODE START ===
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 1, 1000);
    // camera.position.set(6,10 ,);
    camera.position.x=80;
    camera.position.y=1;
    camera.position.z=108;
    
    var renderer = new THREE.WebGLRenderer({ alpha : true });

    const gltfLoader = new GLTFLoader();
    var dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( 'three/examples/js/libs/draco/' );
    gltfLoader.setDRACOLoader(dracoLoader);


    document.getElementById("three").appendChild( renderer.domElement );


    var mesh, mixer, mixer,clock;
    var luz = new THREE.PointLight( 0xffffff, 2, 1000 );
    luz.position.x=4.07625;
    luz.position.y=1.77197;
    luz.position.z=100.1371;
    luz.position.castShadow = true;
    luz.power = 17 ;
    
    const startAnimation =( skinnedMesh, animations, animationName ) =>{

      var mixer = new THREE.AnimationMixer( skinnedMesh );
      for (let i = 0; i < animations.length; i++) {
        var clip = THREE.AnimationClip.findByName( animations, animations[i].name );
        var action = mixer.clipAction( clip );
        action.setLoop(THREE.LoopRepeat, 1);
        
        action.play();

      }
      
    

      return mixer;

    }
    

    const getGltf = () => {
      
      gltfLoader.load( '../assets/servisofts/gltf', function ( gltf ) {
      //gltfLoader.load( '/glbs/eye_implant/scene.gltf', function ( gltf ) {
        mesh =  gltf.scene;
        mesh.rotation.x = 1.7
        mesh.rotation.z = 0.1
        mesh.scale.set(10,10,10)
          
        scene.add(mesh);
        scene.add(luz);
        scene.add(camera);
        mixer =startAnimation(mesh,gltf.animations,'S1Action');
        //mesh.position.z = 4;
        init();
      },  function ( xhr ) {
        console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
      }, function ( error ) {
      
        console.error( error );
      
      } );

    }

    const init = () =>{

      //var mesh = new THREE.Mesh( geometry, faceMaterial );
      var verEnergy = document.getElementById("verEnergy");
      var count = 0;
      var dir = true;
      var animate = function () {
        mixer.update(clock.getDelta());
        // mesh.rotation.z -=Math.PI / 200;
        // camera.rotation.y+=0.01;
        // camera.rotation.x+=0.01;
        if(dir){
          if(count<=0.2){
            dir=false;
          }
          count-=0.02;
        }else{
          if(count>=0.6){
            dir=true;
          }
          count+=0.02;
        }
        verEnergy.style.background="rgba(255,255,255,"+count+")";
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setPixelRatio( window.devicePixelRatio );
        requestAnimationFrame( animate );
        renderer.render( scene, camera );
      };
      animate();
    }
     clock = new THREE.Clock();
      getGltf();
    // === THREE.JS EXAMPLE CODE END ===
  }
  render() {
    return (
      <div />
    )
  }
}
export default Logo;