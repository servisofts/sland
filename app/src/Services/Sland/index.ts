import { SPageListProps } from 'servisofts-component'

const ServiceName = "sland";

import scene from './Components/scene';
import mesh from './Components/mesh';
const Pages: SPageListProps = {
    ...scene.Pages,
    ...mesh.Pages
}

const Reducers = {
    ...scene.Reducers,
    ...mesh.Reducers,
}

export default {
    ServiceName,
    Pages,
    Reducers,
};