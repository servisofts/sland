import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SLoad } from 'servisofts-component';
import { SButtom, SDate, SForm, SNavigation, SPage, SPopup, SText, STheme, SView, SIcon } from 'servisofts-component';
import Usuario from '..';
import SSocket from 'servisofts-socket'
class EditarUsuario extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };

    }
    getForm() {

        var isApi = this.usr.gmail_key || this.usr.facebook_key
        return <SForm
            ref={(ref) => { this.form = ref; }}
            // row
            style={{
                alignItems: "center",
            }}
            inputProps={{
                col: "xs-12",
                customStyle: "kolping",

            }}
            inputs={{
                foto_p: { type: "image", isRequired: false, defaultValue: `${SSocket.api.root}usuario/${this.key}?time=${new Date().getTime()}`, col: "xs-4 sm-3.5 md-3 lg-2.5 xl-2.5", style: { borderRadius: 100, overflow: 'hidden', width: 130, height: 130, borderWidth: 0 } },
                Nombres: { label: "Nombres", isRequired: true, defaultValue: this.usr.Nombres, icon: <SIcon name={"InputUser"} width={40} height={30} /> },
                Apellidos: { label: "Apellidos", isRequired: true, defaultValue: this.usr.Apellidos, icon: <SIcon name={"InputUser"} width={40} height={30} /> },
                CI: { label: "Documento de identidad", defaultValue: this.usr.CI, icon: <SIcon name={"InputUser"} width={40} height={30} /> },
                "Fecha de nacimiento": { label: "Fecha de nacimiento", type: "date", defaultValue: this.usr["Fecha de nacimiento"], icon: <SIcon name={"Calendar"} width={40} height={30} /> },
                "Telefono": { label: "Telefono", defaultValue: this.usr["Telefono"], type: "phone" },
                Correo: { label: "Correo", type: "email", isRequired: true, defaultValue: this.usr.Correo, icon: <SIcon name={"InputEmail"} width={40} height={30} /> },
                ...(isApi ? {} : {
                    Password: { label: "Contraseña", type: "password", isRequired: true, defaultValue: this.usr.Password, icon: <SIcon name={"InputPassword"} width={40} height={30} /> },
                    RepPassword: { label: "Repetir contraseña", type: "password", isRequired: true, defaultValue: this.usr.Password, icon: <SIcon name={"InputRePassword"} width={40} height={30} /> }
                }),
                "Direccion": { label: "Dirección", defaultValue: this.usr["Direccion"], type: "direccion", icon: <SIcon name={"map"} width={40} height={30} /> },

            }}
            onSubmit={(values) => {
                var finalObj = {
                    ...this.usr,
                    ...values
                }
                // if (JSON.stringify(this.usr) != JSON.stringify(finalObj)) {
                Usuario.Actions.editar(finalObj, this.props);
                // }
            }}
        />
    }

    render() {
        var usuario = Usuario.Actions.validateSession(this.props);

        if (!usuario) {
            SNavigation.replace('/');
        }
        this.usr = usuario;
        this.key = usuario.key;
        var reducer = Usuario.Actions._getReducer(this.props);
        if (reducer.estado == "exito" && reducer.type == "editar") {
            reducer.estado = "";
            if (this.form) {
                console.log("ENTRO EDITAR FOTOOOOO")
                this.form.uploadFiles(SSocket.api.root + "upload/usuario/" + this.key);
            }
            SNavigation.goBack();
        }
        return (
            <SPage title={"Editar usuario!"}>
                <SView center>
                    <SView col={"xs-11 md-6 xl-4"} center>
                        <SView height={8} />
                        {/* <SText fontSize={20} bold>{"Editar usuario!"}</SText> */}
                        <SView height={8} />
                        {/* <SView width={160} height={160}>
                            <KFotoPerfil data={usuario} component={"usuario"} />
                        </SView> */}
                        <SView col={"xs-12"}>
                            <SText color={"#DE5738"} fontSize={18} font={"LondonTwo"}>MIS DATOS</SText>
                        </SView>
                        {this.getForm()}
                        <SView height={16} />
                        <SView col={"xs-11"} row center>
                            <SButtom primary props={{
                                type: "outline"
                            }}
                                onPress={() => {
                                    this.form.submit();
                                }}>
                                {"CONFIRMAR"}
                            </SButtom>
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
export default connect(initStates)(EditarUsuario);