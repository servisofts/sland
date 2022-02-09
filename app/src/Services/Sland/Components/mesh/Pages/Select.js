import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SIcon, SLoad, SNavigation, SPage, SPopup, STable2, SText, SView } from 'servisofts-component';
import Parent from ".."
import FloatButtom from '../../../../../Component/FloatButtom';
class Select extends Component {
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
                    key: "key-ver", label: "Ver", width: 50, center: true,
                    component: (item) => {
                        return <SView onPress={() => {
                                var onSelect = SNavigation.getParam("onSelect");
                                if(onSelect){
                                    onSelect(data[item]);
                                }
                                SNavigation.goBack();
                             }}>
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
            <SPage title={'Select' + Parent.component} disableScroll>
                {this.getLista()}
            </SPage>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(Select);