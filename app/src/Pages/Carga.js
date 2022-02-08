import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { SButtom, SHr, SIcon, SNavigation, SPage, SText, SThread, SView } from 'servisofts-component';
// import SThree from '../SThree';

class Carga extends Component {
    constructor(props) {
        super(props);
        this.state = {
            delay: 2500,
        };
    }
    render() {
        // this.hilo()
        return (
            <SPage hidden disableScroll center >
                {/* <SText fontSize={24} bold>3D Render</SText> */}
                {/* <SThree/> */}
            </SPage>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(Carga);