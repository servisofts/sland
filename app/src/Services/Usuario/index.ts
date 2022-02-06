import { SPageListProps } from 'servisofts-component'

const ServiceName = "usuario";

import usuario from './Components/usuario';
import datoCabecera from './Components/datoCabecera';


const Pages: SPageListProps = {
    ...usuario.Pages
}

const Reducers = {
    // "login": Login,
    ...usuario.Reducers,
    ...datoCabecera.Reducers,

}

export default {
    ServiceName,
    Pages,
    Reducers,
};