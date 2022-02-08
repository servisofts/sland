import { SPageListProps } from 'servisofts-component'

const ServiceName = "sland";

import scene from './Components/scene';
import mesh from './Components/mesh';
import scene_mesh from './Components/scene_mesh';
const Pages: SPageListProps = {
    ...scene.Pages,
    ...mesh.Pages,
    ...scene_mesh.Pages,
}

const Reducers = {
    ...scene.Reducers,
    ...mesh.Reducers,
    ...scene_mesh.Reducers,
}

export default {
    ServiceName,
    Pages,
    Reducers,
};