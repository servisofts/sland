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
                key_mesh: this.state.mesh?.key,
                key_usuario_perfil: this.props.state.usuarioReducer.usuarioLog.key
            };
        }
        if (!this.state.mesh) {
            if (this.key) {
                var objMesh = mesh.Actions.getByKey(this.data.key_mesh, this.props);
                if (!objMesh) return <SLoad />
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


                key_usuario_perfil: { label: "key_usuario_perfil", isRequired: true, defaultValue: this.data["key_usuario_perfil"] },
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