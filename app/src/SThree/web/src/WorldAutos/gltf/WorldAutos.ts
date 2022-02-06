
import OBJ_GLTF from "../../../../../Assets/3d/worldAutos.json";
import SCannon from '../SCannon';
import GLTF from "../GLTF";
import { SThread } from "servisofts-component";

export default class WorldAutos {
    main;
    mixer;
    animations;
    constructor(main) {
        this.main = main;
        let Instance = this;
        new GLTF(main).parse(OBJ_GLTF).then(gltf => {
            Instance.addPhysics(gltf, Instance);
        });
        // main.addToRender('worldAutos', this);
    }

    addPhysics(gltf, Instance) {
        new SThread(500, "fisicas", false).start(() => {
            gltf.scene.traverse(function (model) {
                if (model.userData) {
                    Object.keys(model.userData).map((key) => {
                        switch (key) {
                            case 'mass':
                                var type: any = "Box";
                                if (model.userData["pType"]) {
                                    type = model.userData["pType"];
                                }
                                new SCannon(Instance.main, {
                                    mesh: model,
                                    type: type,
                                    mass: model.userData[key],
                                });
                                break;
                        }
                    })
                }
            })
        });
    }

    render() {
        // if (this.mixer) {
        //     this.mixer.update(this.main.DELTA);
        // }

    }
}
