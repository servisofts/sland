import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { SLoad } from 'servisofts-component';
import { SButtom, SDate, SForm, SNavigation, SPage, SPopup, SText, STheme, SView, SIcon } from 'servisofts-component';
import Usuario from '..';
// import BackgroundImage from '../../../Components/BackgroundImage';
// import FotoPerfilComponent from '../../../Components/FotoPerfilComponent';
// import LogoAnimado from '../../CargaPage/LogoAnimado';
// import RolDeUsuario from './RolDeUsuario';

class CodigoRecuperarPass extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
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
                Codigo: { label: "Ingrese el código recibido", type: "text", isRequired: true, icon: <SIcon name={"InputPassword"} width={40} height={30} /> },
            }}
            onSubmit={(values) => {
                // if (this.key) {
                //     Usuario.Actions.recuperarPass({
                //         ...this.usr,
                //         ...values
                //     }, this.props);
                // } else {
                Usuario.Actions.verificarCodigoPass(values, this.key_rol, this.props);
                // }
            }}
        />
    }

    render() {
        var error = Usuario.Actions.getError("verificarCodigoPass", this.props);
        if (error) {
            SPopup.alert("¡Código incorrecto!");
        }
        if (this.props.state.usuarioReducer.estado == "exito" && this.props.state.usuarioReducer.type == "verificarCodigoPass") {
            this.props.state.usuarioReducer.estado = "";
            SNavigation.navigate(Usuario.component + "/nuevaContrasena");
            //alert("¡Código correcto!");
        }
        return (
            <SPage title={"Código de Recuperación"}>
                <SView center>
                    <SView col={"xs-11 md-6 xl-4"} center>
                        <SView height={40} />
                        <SText fontSize={24} color="#DE5738" font="LondonTwo" center>¡Mensaje Enviado!</SText>
                        <SView height={10} />
                        <SText fontSize={16} color="#000" center>Revise su bandeja de entrada e introduzca el código recibido. </SText>
                        <SView height={40} />
                        <SView backgroundColor={STheme.color.primary} width={150} height={150} style={{
                            borderRadius: 35,

                        }} center >
                            <SView height={5} ></SView>
                            <SIcon name={"Message"} width={110} height={110} />
                        </SView>
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
                            >VALIDAR</SButtom>
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
export default connect(initStates)(CodigoRecuperarPass);