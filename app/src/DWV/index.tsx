import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform } from 'react-native';
import { SView } from 'servisofts-component';

import App from './web/App';
// Version: 1.3.3


class DWV extends Component {
    webview;
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        // const html = `<script src="${RNFetchBlob.fs.dirs.MainBundleDir}/bundle.js"></script> `;
        // const Web: any = ("./web/App");
        return <SView col={"xs-12"} height>
            <App />
        </SView>
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(DWV);