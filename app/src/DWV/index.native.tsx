import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform } from 'react-native';
import { SView } from 'servisofts-component';
// import DomWebview from 'react-native-dom-webview';
import { WebView } from 'react-native-webview'
import RNFetchBlob from 'rn-fetch-blob';
declare const DOM: any;

// Version: 1.3.3

const webApp = DOM("./web/App");

class DWV extends Component {
    webview;
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        // const html = `<script src="${RNFetchBlob.fs.dirs.MainBundleDir}/bundle.js"></script> `;
        return (
            <WebView
                // app={webApp}

                scrollEnabled={false}
                pagingEnabled={false}
                allowFileAccessFromFileURLs={true}
                allowFileAccess={true}
                mixedContentMode="compatibility"
                allowUniversalAccessFromFileURLs={true}
                originWhitelist={['*']}
                ref={(ref) => { this.webview = ref }}
                style={{ width: "100%", backgroundColor: 'transparent', }}
                javaScriptEnabled={true}
                javaScriptEnabledAndroid={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                cacheEnabled={false}
                injectedJavaScript={webApp}
                onLoadEnd={() => {
                    // this.send({
                    //     component: "init",
                    //     data: {
                    //         img1: "./ts1.jpg",
                    //     }
                    // });
                }}
                onMessage={(payload) => {
                    let dataPayload;
                    try {
                        dataPayload = JSON.parse(payload.nativeEvent.data);
                    } catch (e) { }

                    if (dataPayload) {
                        if (dataPayload.type === 'Console') {
                            console.info(`[Console] ${JSON.stringify(dataPayload.data)}`);
                        } else {
                            console.log(dataPayload)
                        }
                    }
                    // props.navigation.navigate("Home");
                }}

                // style={{ flex: 1 }}
                source={Platform.OS === 'ios' ? require("./web/index.html") : {
                    // baseUrl: RNFetchBlob.fs.dirs.MainBundleDir,
                    // uri: "file:///android_asset/index.html",
                }}
            // source={require("./web/index.html")}

            />
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(DWV);