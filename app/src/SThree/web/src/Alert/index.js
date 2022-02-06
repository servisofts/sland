
import React, { Component } from "react";

export default class Alert extends Component {
    static _Instance = null;
    static open(props: { key: any, component: any, onClose?: any }) {
        this._Instance.setState({
            alertas: {
                ...this._Instance.state.alertas,
                [props.key]: props,
            }
        });
    }
    static close(key) {
        delete this._Instance.state.alertas[key];
        this._Instance.setState({
            alertas: {
                ...this._Instance.state.alertas,
            }
        });
    }
    constructor(props) {
        super(props);
        this.state = {
            alertas: {}
        };
    }

    componentDidMount() {
        Alert._Instance = this;
    }
    getAlert(obj) {
        var color = "#ffffff";
        return <div style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",

        }} onClick={()=>{
            Alert.close(obj.key);
            if(obj.onClose){
                obj.onClose();
            }
        }}>
            <div style={{
                position: "absolute",
                width: 500,
                maxWidth: "90%",
                height: 200,
                borderRadius: "8px",
                color: "#000",
            }}>
                <div style={{
                    width: "100%",
                    height: "100%",
                    background: color + "99",
                    border: "2px solid " + color,
                    borderRadius: "8px",
                    filter: "blur(8px)",
                    backdropFilter: "blur(8px)",
                }}>
                </div>
                <div style={{
                    width: "100%", height: "100%", top: 0, position: "absolute", justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                }}>
                    {obj.component}
                </div>
            </div>
        </div>
    }
    render() {
        return (<div>
            {Object.keys(this.state.alertas).map(key => {
                return this.getAlert(this.state.alertas[key])
            })}
        </div>
        )
    }
}