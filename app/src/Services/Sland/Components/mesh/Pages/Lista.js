import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SIcon, SLoad, SNavigation, SPage, SPopup, STable2, SText, SView } from 'servisofts-component';
import Parent from ".."
import FloatButtom from '../../../../../Component/FloatButtom';
class Lista extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        // this.key_scene = SNavigation.getParam("key_scene");
    }

    getLista() {
        var data = Parent.Actions.getAll(this.props);
        if (!data) return <SLoad />
        return <STable2
            header={[
                { key: "index", label: "#", width: 50 },
                { key: "descripcion", label: "Descripcion", width: 150 },
                { key: "tipo", label: "Tipo", width: 100, center: true },
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
                {
                    key: "key-ver", label: "Ver", width: 50, center: true,
                    component: (item) => {
                        return <SView onPress={() => { SNavigation.navigate(Parent.component + "/perfil", { key: item }) }}>
                            <SIcon name={"Salir"} width={35} />
                        </SView>
                    }
                },


            ]}
            filter={(data) => {
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
                    SNavigation.navigate(Parent.component + "/registro");
                }} />
            </SPage>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(Lista);