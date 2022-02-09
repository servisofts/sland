import { SPageListProps } from 'servisofts-component'

const ServiceName = "sland";

import scene from './Components/scene';
import mesh from './Components/mesh';
import scene_mesh from './Components/scene_mesh';
import mesh_usuario from './Components/mesh_usuario';
const Pages: SPageListProps = {
    ...scene.Pages,
    ...mesh.Pages,
    ...scene_mesh.Pages,
    ...mesh_usuario.Pages
}

const Reducers = {
    ...scene.Reducers,
    ...mesh.Reducers,
    ...scene_mesh.Reducers,
    ...mesh_usuario.Reducers
}

export default {
    ServiceName,
    Pages,
    Reducers,
};