import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SIcon, SLoad, SNavigation, SPage, SPopup, STable2, SText, SView } from 'servisofts-component';
import Parent from ".."
import FloatButtom from '../../../../../Component/FloatButtom';
import mesh from '../../mesh';
class Lista extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.key_scene = SNavigation.getParam("key_scene");
        this.key_mesh = SNavigation.getParam("key_mesh");
    }

    getLista() {
        var data = Parent.Actions.getAll(this.props);
        var meshData = mesh.Actions.getAll(this.props);
        if (!data) return <SLoad />
        if (!meshData) return <SLoad />

        return <STable2
            header={[
                { key: "index", label: "#", width: 50 },
                {
                    key: "position", label: "Position", width: 150, center: true, component: (item) => {
                        return <SText>{JSON.stringify(item, "\n", "\t").replace(/\"|,/g, "")}</SText>
                    }
                },
                {
                    key: "rotation", label: "Rotation", width: 150, center: true, component: (item) => {
                        return <SText>{JSON.stringify(item, "\n", "\t").replace(/\"|,/g, "")}</SText>
                    }
                },
                {
                    key: "scale", label: "Scale", width: 150, center: true, component: (item) => {
                        return <SText>{JSON.stringify(item, "\n", "\t").replace(/\"|,/g, "")}</SText>
                    }
                },
                {
                    key: "key_mesh", label: "key_mesh", width: 150, render: (item) => {
                        return meshData[item]?.descripcion
                    }
                },
                {
                    key: "key-editar", label: "Editar", width: 50, center: true,
                    component: (item) => {
                        return <SView onPress={() => { SNavigation.navigate(Parent.component + "/registro", { key: item }) }}>
                            <SIcon name={"Edit"} width={35} />
                        </SView>
                    }
                },


                {
                    key: "key-eliminar", label: "Eliminar", width: 70, center: true,
                    component: (key) => {
                        return <SView width={35} height={35} onPress={() => { SPopup.confirm({ title: "Eliminar", message: "¿Esta seguro de eliminar?", onPress: () => { Parent.Actions.eliminar(data[key], this.props) } }) }}>
                            <SIcon name={'Delete'} />
                        </SView>
                    }
                },


            ]}
            filter={(data) => {
                if (this.key_scene) {
                    if (data.key_scene != this.key_scene) return false;
                }
                if (this.key_mesh) {
                    if (data.key_mesh != this.key_mesh) return false;
                }
                if (data.estado != 1) return false;
                return true;
            }}
            data={data}
        />
    }

    render() {
        return (
            <SPage title={'Lista de ' + Parent.component} disableScroll>
                {this.getLista()}
                <FloatButtom onPress={() => {
                    SNavigation.navigate(Parent.component + "/registro", { key_scene: this.key_scene, key_mesh: this.key_mesh });
                }} />
            </SPage>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(Lista);