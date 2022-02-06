import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';


export default class HtmlObj {
    main;
    constructor(main, mesh, content, { width, height }) {
        this.main = main;
        var div = document.createElement('div');
        var ampliar = 500;

        var resolution = { width: width, height: height };


        div.style.width = resolution.width + "px";
        div.style.height = resolution.height + "px";
        div.style.margin = "0px";
        div.style.padding = "0px";
        div.style.position = "absolute";

        // div.style.overflow = "hidden";
        div.innerHTML = `
        <div style="position: absolute;width: 100%;height:100%; pointer-events: none; ">
            <div style="position: absolute;width:100%;height:100%;  ">
                <div style="position:absolute; width:100%; height:100%;">
                ${content}
                </div>
            </div>
        </div>
        `;
        var cssObject = new CSS3DObject(div);
        cssObject.scale.set(mesh.scale.x / (resolution.width / 2), mesh.scale.y / (resolution.height / 2), 1);
        cssObject.rotation.set(mesh.rotation.x, mesh.rotation.y, mesh.rotation.z);
        cssObject.position.set(mesh.position.x, mesh.position.y, mesh.position.z);
        main.scene.add(cssObject);
        return cssObject;
    }

    render() {
    }
}
