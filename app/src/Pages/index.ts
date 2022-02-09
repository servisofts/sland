import { SPageListProps } from 'servisofts-component'
import Services from '../Services';


import Carga from './Carga';
import Home from './Home';

const Pages: SPageListProps = {
    "/": Home,
    "carga": Carga,
    ...Services.Pages,
}

export default Pages;