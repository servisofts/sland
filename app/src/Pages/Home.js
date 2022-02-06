import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SHr, SNavigation, SPage, SText, SThread, SView, STheme } from 'servisofts-component';
import Pages from "../Pages/index";
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            delay: 2500,

        };
    }



    accesoModelo(url, size) {
        return <SView
            card
            col={"xs-11 md-6"}
            height={40}
            style={{
                padding: 8,
            }}
            onPress={() => { SNavigation.navigate(url) }}
        >
            <SText secondary style={{
                marginStart: size*8,
            }}>{url}</SText>
        </SView>
    }
    accesos() {
        return Object.keys(Pages).map((key) => {
            // if(key.indexOf("/") > 0) return null;
            var spli = key.split("/");
            if(key.indexOf("/") == 0 ) spli = [""] 
            return <>
                <SView height={8} />
                {this.accesoModelo(key, spli.length-1)}
            </>
        })
    }

    render() {
        return (
            <SPage title={'Home'}>
                <SView col={"xs-12"} center>
                    {this.accesos()}
                </SView>
            </SPage>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(Home);