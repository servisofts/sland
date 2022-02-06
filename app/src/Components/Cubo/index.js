import React, { Component } from 'react';
import { View, Text, Platform } from 'react-native';
import { SGradient, SIcon, SImage } from 'servisofts-component';

type type = {
    source: Object,
    contraste: String
}

export default class BackgroundImage extends Component<type> {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    getBackground = () => {
        var source = this.props.source;
        if (!source) {
            source = require("./background.png");
        }
        return <View style={{
            width: "100%",
            bottom: 0,
            left: 0,
            position: "absolute",
            ...this.props.style,
        }}>
            <SIcon name={"Bg1"} />
            
        </View>
    }
    render() {
        // if (!this.props.source) {
        //     return <View />
        // }
        return this.getBackground()
    }
}
