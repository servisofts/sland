import React, { Component } from 'react';
import * as THREE from "three";

export default class LoadingWindow extends Component {
    static getLoadingManager(main) {
        if (main.loadingManager) return main.loadingManager;

        main.loadingManager = new THREE.LoadingManager();
        main.loadingManager.onProgress = function (item, loaded, total) {
            document.getElementById("loadingWindow").style.visibility = "visible";
            console.log(loaded, total);
        };
        main.loadingManager.onLoad = function () {
            document.getElementById("loadingWindow").style.visibility = "hidden";
            console.log("loaded all resources");
        };

    }

    render() {
        return (
            <div
                id="loadingWindow"
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "#000",
                    visibility: "hidden",
                    textAlign: "center",
                    color: "#fff"
                }}>
                <h4>Cargando...</h4>
            </div>
        );
    }
}
