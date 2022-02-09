import React, { Component } from 'react';
import { SLoad, SView } from 'servisofts-component';
import App, { AppProps } from './web/App';
// Version: 1.3.3


export default class SThree extends Component<AppProps> {
    state;
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    getApp() {
        if (!this.state.layout) return <SLoad />
        return <App
            meshes={this.props.meshes}
            renderer={{
                width: this.state.layout.width,
                height: this.state.layout.height
            }} />
    }
    render() {
        return <SView col={"xs-12"} height card onLayout={(evt) => {
            var layout = evt.nativeEvent.layout;
            this.setState({ layout });
        }}>
            {this.getApp()}
        </SView>
    }
}