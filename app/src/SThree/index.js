import React, { Component } from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import { WebView } from 'react-native-webview'
import { SText, SView } from 'servisofts-component';
import { renderToString } from 'react-dom/server'
// import App from 'render-hardrock';
export default class SThree extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    send(obj) {
        this.webview.postMessage(JSON.stringify(obj));
    }
    renderHtmlAndroid = (data) => {
        return `<div>
                 <style>
                   .block {}
                 </style>
                 <div class="block">${data}<div>
                <div>`
    }

    renderHtmliOs = (data) => {
        return `<!DOCTYPE html>
                <html>
                  <head>
                   <title>Title</title>
                   <meta charset="UTF-8" />
                  </head>
                  <body>
                   <div id="app">${data}</div>
                  </body>
                 </html>`
    }

    render() {
        return (
            <SView col={"xs-12"} height>
                <WebView
                    ref={(ref) => {
                        this.webview = ref;
                    }}
                    style={{ width: "100%", backgroundColor: 'transparent', }}
                    originWhitelist={['*']}
                    source={{ html: !Platform.OS ? this.renderHtmlAndroid([]) : this.renderHtmliOs([require("../Components/Cubo/index.js")]) }}
                    // source={require("../Components/3d/index.html")}
                    // source={{html:"Web.bundle/index.html"}}
                    // source={{ html: renderToString() }}
                    javaScriptEnabled={true}
                    scrollEnabled={false}
                    // injectedJavaScript={App}
                    onLoadEnd={() => {
                        // this.send({
                        //     component: "init",
                        //     data: {
                        //         img1: "./ts1.jpg",
                        //     }
                        // });
                    }}
                    onMessage={(data) => {
                        var data = data.nativeEvent.data;
                        console.log(data);
                        // props.navigation.navigate("Home");
                    }}
                ></WebView>
            </SView >
        );
    }
}
