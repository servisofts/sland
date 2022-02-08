import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { SHr, SLoad } from 'servisofts-component';
import { SButtom, SDate, SForm, SNavigation, SPage, SPopup, SText, STheme, SView, SIcon } from 'servisofts-component';
import Usuario from '..';
// import BackgroundImage from '../../../Components/BackgroundImage';
// import FotoPerfilComponent from '../../../Components/FotoPerfilComponent';
// import LogoAnimado from '../../CargaPage/LogoAnimado';
// import RolDeUsuario from './RolDeUsuario';

class RecuperarPass extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.key = SNavigation.getParam("key");
        this.key_rol = SNavigation.getParam("key_rol");
        if (!this.key_rol) {
            this.key_rol = "d16d800e-5b8d-48ae-8fcb-99392abdf61f";
        }
    }
    getForm() {
        return <SForm
            ref={(ref) => { this.form = ref; }}
            row
            style={{
                justifyContent: "space-between",
            }}
            inputProps={{
                col: "xs-12",
                customStyle: "kolping",
            }}
            inputs={{
                Correo: { label: "Ingrese su correo electrónico", type: "email", isRequired: true, icon: <SIcon name={"InputEmail"} width={40} height={30} /> },
            }}
            onSubmit={(values) => {
                // if (this.key) {
                //     Usuario.Actions.recuperarPass({
                //         ...this.usr,
                //         ...values
                //     }, this.props);
                // } else {
                Usuario.Actions.recuperarPass(values, this.key_rol, this.props);
                // }
            }}
        />
    }

    render() {
        var error = Usuario.Actions.getError("recuperarPass", this.props);
        if (error) {
            SPopup.alert("Usuario no encontrado, Verifique sus datos.");
        }
        if (this.props.state.usuarioReducer.estado == "exito" && this.props.state.usuarioReducer.type == "recuperarPass") {
            this.props.state.usuarioReducer.estado = "";
            SNavigation.navigate(Usuario.component + "/codigoRecuperarContrasena");
        }
        return (
            <SPage title={"Recuperar Contraseña"}>
                <SView center>
                    <SView col={"xs-11 md-6 xl-4"} center>
                        <SView height={40} />
                        <SText fontSize={16} color="#000" center>Le enviaremos un mensaje para configurar o restablecer su nueva contraseña. </SText>
                        <SView height={40} />
                        {/* {this.key ? <SView col={"xs-6"} height={150}> <FotoPerfilComponent data={this.usr} component={"usuario"} /> </SView> : null} */}
                        {this.getForm()}
                        <SView height={16} />
                        <SView col={"xs-11"} row center>
                            <SButtom primary props={{
                                // type: STheme.color.primary
                            }}
                                onPress={() => {
                                    this.form.submit();
                                }}
                            >ENVIAR CÓDIGO</SButtom>
                        </SView>
                        <SHr />
                        <SHr />
                        <SHr />
                        <SView col={"xs-11"} row center onPress={() => {
                            SNavigation.navigate(Usuario.component + "/codigoRecuperarContrasena");
                        }}>
                            <SText fontSize={14} style={{
                                textDecorationLine: "underline",
                            }}>Ya tengo un codigo!</SText>
                        </SView>
                        <SView height={36} />
                    </SView>
                    {/* <RolDeUsuario data={this.usr} /> */}
                </SView>
            </SPage>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(RecuperarPass);