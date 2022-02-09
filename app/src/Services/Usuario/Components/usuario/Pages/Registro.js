import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SButtom, SForm, SHr, SPage, SText, SNavigation, SLoad, SView, SIcon, SPopup, STheme } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Parent from '../index'
class Registro extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.key = SNavigation.getParam("key");
        this.type = SNavigation.getParam("type");
    }
    getContent() {
        this.usr = {};
        if (this.key) {
            this.usr = Parent.Actions.getByKey(this.key, this.props);
            if (!this.usr) return <SLoad />
        }
        if (this.type) {
            var reducer = this.props.state.usuarioReducer;
            switch (this.type) {
                case "gmail":
                    var data = reducer.gmailData;
                    if (!data) {
                        SNavigation.goBack();
                        return;
                    }
                    this.usr = {
                        gmail_key: data.id,
                        Correo: data.email,
                        Nombres: data.givenName,
                        Apellidos: data.familyName,
                    }
                    break;
                case "facebook":
                    var data = reducer.facebookData;
                    if (!data) {
                        SNavigation.goBack();
                        return;
                    }
                    this.usr = {
                        facebook_key: data.id,
                        // Correo: data.email,
                        Nombres: data.first_name,
                        Apellidos: data.last_name,
                    }
                    break;
            }
        }
        return <SForm
            ref={(form) => { this.form = form; }}
            col={"xs-11 sm-9 md-7 lg-5 xl-4"}
            inputProps={{
                col: "xs-12",
                customStyle: "calistenia",
            }}
            style={{
                alignItems: "center",
            }}

            inputs={{
                // foto_p: { type: "image", isRequired: false, defaultValue: `${SSocket.api.root}${Parent.component}/${this.key}`, col: "xs-4 sm-3.5 md-3 lg-2.5 xl-2" },
                Nombres: { label: "Nombres", isRequired: true, defaultValue: this.usr.Nombres, icon: <SIcon name={"InputUser"} width={40} height={30} /> },
                Apellidos: { label: "Apellidos", isRequired: true, defaultValue: this.usr.Apellidos, icon: <SIcon name={"InputUser"} width={40} height={30} /> },
                // CI: { label: "Documento de identidad", defaultValue: this.usr.CI, icon: <SIcon name={"InputUser"} width={40} height={30} /> },
                // "Fecha de nacimiento": { label: "Fecha de nacimiento", defaultValue: this.usr["Fecha de nacimiento"], icon: <SIcon name={"Calendar"} width={40} height={30} />, type: "date" },
                // "Telefono": { label: "Telefono", defaultValue: this.usr["Telefono"], type: "phone" },
                Correo: { label: "Correo", type: "email", isRequired: true, defaultValue: this.usr.Correo, icon: <SIcon name={"InputEmail"} width={40} height={30} /> },
                ...(!this.type ? {
                    Password: { label: "Password", isRequired: true, type: "password", defaultValue: this.usr.Password, icon: <SIcon name={"InputPassword"} width={40} height={30} /> },
                    RepPassword: { label: "Repetir password", type: "password", isRequired: true, defaultValue: this.usr.Password, icon: <SIcon name={"InputRePassword"} width={40} height={30} /> },
                } : {})
            }}
            onSubmit={(values) => {
                if (this.key) {
                    Parent.Actions.editar({
                        ...this.usr,
                        ...values
                    }, this.props);
                } else {
                    if (this.type) {
                        console.log(this.usr);
                        switch (this.type) {
                            case "gmail":
                                values["gmail_key"] = this.usr.gmail_key;
                                if (!values["gmail_key"]) return null;
                                break;
                            case "facebook":
                                break;
                        }
                    }
                    Parent.Actions.registro(values, this.props);
                }
            }}
        />
    }

    alertError(error) {
        return <SView col={"xs-12 md-8 xl-6"} row style={{ height: 250, borderRadius: 8, }} backgroundColor={STheme.color.background}>
            {/* <BackgroundImage /> */}
            <SView style={{
                width: "100%",
                top: 0,
                left: 0,
                position: "absolute",
                ...this.props.style,
            }}>
                <SIcon name={"Enfermera10"} height={500} />
            </SView>
            <SView col={"xs-3"}  ></SView>
            <SView col={"xs-9"} style={{
                // width: "100%",
                // height: "100%",
            }} center>
                <SText style={{ fontSize: 16, }}>El usuario ya existe</SText>
                <SView height={8} />
                {/* <SText secondary style={{ fontSize: 12, }}>{`Nombre: ${error["Nombres"] + " " + error["Apellidos"]}`}</SText> */}
                <SText secondary style={{ fontSize: 12, }}>{`Correo: ${error["Correo"]}`}</SText>
                <SView height={30}></SView>
                {/* <SText style={{ fontSize: 12, }}>{`Fecha nacimiento: ${error["Fecha nacimiento"]}`}</SText> */}
                {/* <SText secondary style={{ fontSize: 12, }}>{`CI: ${error["CI"]}`}</SText>
                <SText secondary style={{ fontSize: 12, }}>{`Telefono: ${error["Telefono"]}`}</SText> */}
            </SView>
        </SView>
    }


    render() {
        var error = Parent.Actions.getError("registro", this.props);
        if (error) {
            SPopup.open({ key: "errorRegistro", content: this.alertError(error) });
        }
        if (this.props.state.usuarioReducer.estado == "exito" && (this.props.state.usuarioReducer.type == "registro") || (this.props.state.usuarioReducer.type == "editar")) {
            this.props.state.usuarioReducer.estado = "";
            if (this.props.state.usuarioReducer.lastRegister) {
                this.key = this.props.state.usuarioReducer.lastRegister.key;
                var lastRegister = this.props.state.usuarioReducer.lastRegister;
                if (lastRegister.key) {
                    if (!Parent.Actions.validateSession(this.props, true)) {
                        if (lastRegister.gmail_key) {
                            Parent.Actions.loginGoogle({
                                id: lastRegister.gmail_key
                            }, this.props);
                        } else {
                            Parent.Actions.login({
                                usuario: this.props.state.usuarioReducer.lastRegister.Correo,
                                password: this.props.state.usuarioReducer.lastRegister.Password
                            }, this.props);
                        }

                    }
                }
            }
            if (this.form) {
                this.form.uploadFiles(SSocket.api.root + "upload/" + Parent.component + "/" + this.key);
            }
            // SNavigation.goBack();
        }
        if (this.key) {
            this.usr = Parent.Actions.getByKey(this.key, this.props);
            if (!this.usr) return <SLoad />
        }
        return (
            <SPage title={'Registro de ' + Parent.component} center>
                <SView height={30}></SView>
                <SView col={"xs-12"} center>
                    {this.getContent()}
                </SView>
                <SHr height={25} />
                <SView col={"xs-11 sm-9 md-7 lg-5 xl-4"} height={30}>
                    <SView col={"xs-10"} row center>
                        <SView col={"xs-1"} >
                            <SIcon name='IconChecked' fill={STheme.color.primary} width={18} height={18}></SIcon>
                        </SView>
                        <SView col={"xs-9"} center style={{ alignItems: "center" }} onPress={() => {
                            SNavigation.navigate('terminos');
                        }} >
                            <SText color={STheme.color.text} fontSize={14} font={"LondonBetween"} style={{ textDecorationLine: 'underline' }} >
                                Aceptar términos y condiciones
                            </SText>
                        </SView>
                    </SView>
                </SView>
                <SHr height={25} />
                <SButtom
                    props={{
                        type: "outline"
                    }}
                    onPress={() => { this.form.submit() }}
                >{(this.key ? "Editar" : "Registrar")}</SButtom>
                <SView height={40}></SView>
            </SPage>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(Registro);