import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SHr, SLoad, SNavigation, SPage, SText, SView } from 'servisofts-component';
import Parent from ".."
import scene_mesh from '../../scene_mesh';
import SThree from '../../../../../SThree';
import mesh_usuario from '../../mesh_usuario';
class Perfil extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.key = SNavigation.getParam("key");
    }

    getSceneData() {
        var data = Parent.Actions.getByKey(this.key, this.props);
        if (!data) return <SLoad />
        return <SText>{JSON.stringify(data)}</SText>
    }
    getThree() {
        var scene_mesh_data = scene_mesh.Actions.getAllByKeyScene(this.key, this.props);
        var player = mesh_usuario.Actions.getMio(this.props);
        if (!scene_mesh_data) return <SLoad />
        if (!player) return <SLoad />
        return <SThree
            player={player}
            meshes={scene_mesh_data.map((k) => {
                return {
                    ...k,
                }
            })} />
    }
    render() {
        return (
            <SPage title={'Perfil'} disableScroll center>
                {this.getSceneData()}
                <SHr />
                <SHr />
                <SView col={"xs-10"} flex>
                    {this.getThree()}
                </SView>
                <SHr />
                <SHr />
            </SPage>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(Perfil);