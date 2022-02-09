import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SButtom, SHr, SNavigation, SPage, SText, SView, SLoad } from 'servisofts-component';
import usuario from '../Services/Usuario/Components/usuario';
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    getButtom(name) {
        return <SButtom props={{
            type: "danger"
        }} onPress={() => {
            SNavigation.navigate(name);
        }}>{name}</SButtom>
    }
    render() {

        if (!usuario.Actions.validateSession(this.props)) {
            return <SLoad />
        }
        return (
            <SPage title={'Home'} hidden center>
                <SHr />
                <SText font={"Roboto"} fontSize={18}>{'Bienvenido a Servisofts Land'}</SText>
                <SHr />
                <SView row col={"xs-11"}>
                    {this.getButtom('scene')}
                    <SView width={8} />
                    {this.getButtom('mesh')}
                    <SView width={8} />
                    {this.getButtom('mesh_usuario')}
                    <SView width={8} />
                </SView>
            </SPage>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(Home);