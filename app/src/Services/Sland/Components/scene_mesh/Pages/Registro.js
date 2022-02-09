import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SForm, SHr, SIcon, SNavigation, SPage, SText, SView, SLoad } from 'servisofts-component';
import Parent from '../index';
import SSocket from 'servisofts-socket';
import mesh from '../../mesh';

class Registro extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.key = SNavigation.getParam("key");
        this.key_scene = SNavigation.getParam("key_scene");
        this.key_mesh = SNavigation.getParam("key_mesh");
    }

    getContent() {
        this.data = {};
        if (this.key) {
            this.data = Parent.Actions.getByKey(this.key, this.props);
            if (!this.data) return <SLoad />
        } else {
            this.data = {
                key_scene: this.key_scene,
                key_mesh: this.state.mesh?.key,
                position: { x: 0, y: 0, z: 0 },
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1, z: 1 },
            };
        }
        if (!this.state.mesh) {
            if (this.key) {
                var objMesh  = mesh.Actions.getByKey(this.data.key_mesh, this.props);
                if(!objMesh) return <SLoad/>
                this.state.mesh = objMesh;
            } else {
                SNavigation.navigate("mesh/select", {
                    onSelect: (obj) => {
                        this.setState({
                            mesh: obj
                        })
                    }
                });
                return <SLoad />
            }
        }
        return <SForm
            center
            row
            ref={(form) => { this.form = form; }}
            col={"xs-11 sm-9 md-7 lg-5 xl-4"}
            inputProps={{
                customStyle: "calistenia"
            }}
            inputs={{
                // foto_p: { type: "image", isRequired: false, defaultValue: `${SSocket.api.root}sucursal/${this.key}?time=${new Date().getTime()}`, col: "xs-4 sm-3.5 md-3 lg-2.5 xl-2.5", style: { borderRadius: 8, overflow: 'hidden', width: 130, height: 130, borderWidth: 0 } },
                // descripcion: { label: "Descripcion", isRequired: true, defaultValue: this.data["descripcion"] },
                positionX: { label: "position X", defaultValue: this.data["position"]?.x, col: "xs-4" },
                positionY: { label: "position Y", defaultValue: this.data["position"]?.y, col: "xs-4" },
                positionZ: { label: "position Z", defaultValue: this.data["position"]?.z, col: "xs-4" },

                rotationX: { label: "rotation X", defaultValue: this.data["rotation"]?.x, col: "xs-4" },
                rotationY: { label: "rotation Y", defaultValue: this.data["rotation"]?.y, col: "xs-4" },
                rotationZ: { label: "rotation Z", defaultValue: this.data["rotation"]?.z, col: "xs-4" },

                scaleX: { label: "scale X", defaultValue: this.data["scale"]?.x, col: "xs-4" },
                scaleY: { label: "scale Y", defaultValue: this.data["scale"]?.y, col: "xs-4" },
                scaleZ: { label: "scale Z", defaultValue: this.data["scale"]?.z, col: "xs-4" },

                key_scene: { label: "key_scene", isRequired: true, defaultValue: this.data["key_scene"] },
                mesh: {
                    label: "Mesh", editable: false, value: this.state.mesh?.descripcion, onPress: () => {
                        SNavigation.navigate("mesh/select", {
                            onSelect: (obj) => {
                                this.setState({
                                    mesh: obj
                                })
                            }
                        });
                    }
                },
            }}
            onSubmitName={"Guardar"}
            onSubmit={(values) => {
                values.key_mesh = this.state.mesh?.key;
                values.position = {
                    x: values.positionX,
                    y: values.positionY,
                    z: values.positionZ,
                }
                values.rotation = {
                    x: values.rotationX,
                    y: values.rotationY,
                    z: values.rotationZ,
                }
                values.scale = {
                    x: values.scaleX,
                    y: values.scaleY,
                    z: values.scaleZ,
                }
                delete values.positionX;
                delete values.positionY;
                delete values.positionZ;
                delete values.rotationX;
                delete values.rotationY;
                delete values.rotationZ;
                delete values.scaleX;
                delete values.scaleY;
                delete values.scaleZ;

                if (this.key) {
                    Parent.Actions.editar({ ...this.data, ...values }, this.props);
                } else {
                    Parent.Actions.registro(values, this.props);
                }
            }}
        />
    }

    render() {
        var reducer = this.props.state[Parent.component + "Reducer"];
        if (reducer.type == "registro" || reducer.type == "editar") {
            if (reducer.estado == "exito") {
                if (reducer.type == "registro") this.key = reducer.lastRegister?.key;
                // if (this.form) {
                //     this.form.uploadFiles(SSocket.api.root + "upload/" + Parent.component + "/" + this.key);
                // }

                reducer.estado = "";
                SNavigation.goBack();
            }
        }

        return (
            <SPage title={'Registro de ' + Parent.component} center>
                <SView height={30}></SView>
                {this.getContent()}
                <SHr />
            </SPage>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(Registro);