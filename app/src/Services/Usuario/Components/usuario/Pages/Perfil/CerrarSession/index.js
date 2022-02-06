import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { SPopup } from 'servisofts-component';
import Usuario from '../../..';
import Kolping from '../../../../../Components/Kolping';

class CerrarSession extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <Kolping.KButtom secondary onPress={() => {
                SPopup.confirm({
                    title: "Cerrar sesión", message: "Seguro que desea desconectar su usuario?", onPress: () => {
                        Usuario.Actions.logout(this.props)
                    }
                })
            }}>
                CERRAR SESIÓN
            </Kolping.KButtom>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(CerrarSession);