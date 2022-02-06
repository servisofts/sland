import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { SDate, SImage, SNavigation, SPage, SView, SButtom, SText, SIcon, SHr,STheme } from 'servisofts-component';
import SSocket from 'servisofts-socket';
// import CerrarSession from './CerrarSession';

// import AppParams from '../../Params';
// import FilePreview from '../CarpetasPage/FilePreview';
// import * as SImageImput from '.././../Component/SImageImput';
// import moment from 'moment';
// import SImage from '../../Component/SImage';
// import CerrarSession from './CerrarSession';


class Perfil extends Component {
    static navigationOptions = {
        headerShown: false,
    }
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount() {
        // this.props.dispatch({
        //     component: "image",
        //     type: "cambio",
        //     url: AppParams.urlImages + "usuario_" + usuario.key,
        // })
    }
    getPerfil() {
        var usuario = this.props.state.usuarioReducer.usuarioLog;
        if (!usuario) {
            SNavigation.navigate('login');
            return <SView />
        }
        return (
            <SView center>
                <SView style={{
                    width: 140,
                    height: 140,
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <SView style={{
                        width: "90%",
                        height: "90%",
                        backgroundColor: "#66000022",
                        borderRadius: 100,
                        overflow: "hidden",
                    }} >
                        <SImage src={`${SSocket.api.root}usuario/${usuario.key}?time=${new Date().getTime()}`} style={{
                            width: "100%",
                            height: "100%",
                        }} />


                    </SView>
                </SView>
                <SHr />
                <SView >
                    <SView center>
                        <SText style={{
                            // flex: 5,
                            fontSize: 18,
                            // fontWeight: "bold",
                            // color: "#fff"
                        }} font='LondonBetween'>{usuario["Nombres"] + " " + usuario["Apellidos"]} </SText>
                    </SView>
                    <SHr />
                    <SView center>
                        <SText style={{
                            fontSize: 14,
                            // color: "#bbb"
                        }} font={"LondonBetween"} color={STheme.color.gray} font={"LondonMM"}>{usuario["CI"] ?? "--"} </SText>
                    </SView>
                </SView>
            </SView>
        )
    }
    getDato(key, icon) {
        var text = this.usuario[key] ?? '--';
        if (key == "Password") {
            text = "************"
        }
        return <SView row col={"xs-12"} center>
            <SHr />
            <SHr />
            <SIcon name={icon} width={40} height={30} />
            <SView width={16} />
            <SText>{text}</SText>
            <SView flex />
        </SView>
    }
    getDatos() {
        return <SView col={"xs-12"} center>
            {/* {this.getDato("Nombres", "InputUser")} */}
            {/* {this.getDato("Apellidos", "InputUser")} */}
            {/* {this.getDato("CI", "InputUser")} */}
            {this.getDato("Fecha de nacimiento", "Calendar")}
            {this.getDato("Telefono", "InputPhone")}
            {this.getDato("Correo", "InputEmail")}
            {this.getDato("Password", "InputPassword")}
            {this.getDato("Direccion", "InputLocation")}

        </SView>
    }
    render() {
        var usuario = this.props.state.usuarioReducer.usuarioLog;
        this.usuario = usuario;
        if (!usuario) {
            SNavigation.navigate('login');
            return <SView />
        }
        return (
            <SPage title="Editar Perfil" center>
                <SView col={"xs-11 sm-10 md-8 lg-6 xl-4"} center>
                    <SView height={80}></SView>
                    {this.getPerfil()}
                    <SView height={10}></SView>
                    {this.getDatos()}
                    <SView height={50}></SView>

                    <SButtom primary onPress={() => {
                        SNavigation.navigate("editar", {
                            key: usuario.key,
                        })
                    }}>EDITAR</SButtom>
                    <SView height={30}></SView>

                </SView>
            </SPage>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(Perfil);