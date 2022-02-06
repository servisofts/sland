import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SHr, SNavigation, SPage, SText, SView, STheme, SLoad, SButtom, SIcon } from 'servisofts-component';
class Ajustes extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    logout() {
        return <SButtom props={{ type: "danger" }} onPress={() => {
            this.props.dispatch({ type: "USUARIO_LOGOUT" });
            SNavigation.replace("carga");
        }}>Logout</SButtom>
    }
    render() {
        return (
            <SPage title={'Configuraciones'}>
                <SView col={"xs-12"} center>
                    <SView col={"xs-11"}>
                        <SView>
                            <SText>{"Cuenta"}</SText>
                        </SView>

                        <SText fontSize={12} ><SIcon name="Ver" width={9} color="#000" /> Perfil </SText>
                        <SText fontSize={12} ><SIcon name="Ver" width={9} color="#000" /> ¡Valoranos! </SText>
                        <SText fontSize={12} ><SIcon name="Ver" width={9} color="#fff" /> Metodo de pago</SText>
                        <SText fontSize={12} ><SIcon name="Ver" width={9} color="#fff" /> Ayuda</SText>
                        <SView>
                            <SText>{"Ajustes"}</SText>
                        </SView>
                        <SText fontSize={12} ><SIcon name="Ver" width={9} color="#fff" /> Notificaciones </SText>
                        <SText fontSize={12} ><SIcon name="Ver" width={9} color="#fff" /> Privacidad </SText>
                    </SView>
                </SView>
            </SPage>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(Ajustes);