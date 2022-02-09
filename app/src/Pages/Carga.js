import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { SHr, SIcon, SNavigation, SPage, SThread, SView } from 'servisofts-component';
import usuario from '../Services/Usuario/Components/usuario';

class Carga extends Component {
    constructor(props) {
        super(props);
        this.state = {
            delay: 2500,
        };
    }

    redirect() {
        if (!usuario.Actions.validateSession(this.props, true)) {
            SNavigation.replace("login");
        } else {
            SNavigation.replace("/");
        }
    }
    hilo() {
        new SThread(this.state.delay, "cargaHilo", true).start(() => {
            this.redirect();
        });
    }
    render() {
        this.hilo()
        return (
            <SPage hidden disableScroll center>
                <SHr height={32} />
                <SView col={"xs-9 sm-7 md-5 lg-4 xl-3"} height={200}>
                    <SIcon name={"Logo"} />
                </SView>
                <SHr height={32} />

            </SPage>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(Carga);