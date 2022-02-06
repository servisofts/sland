import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import { Platform } from 'react-native';
import { SView } from 'servisofts-component';

import App from './web/App';
// Version: 1.3.3


export default class SThree extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return <SView col={"xs-12"} height>
            <App/>
        </SView>
    }
}