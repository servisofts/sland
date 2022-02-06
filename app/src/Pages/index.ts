import { SPageListProps } from 'servisofts-component'
import Carga from './Carga';
import Home from './Home';
import Services from '../Services';
const Pages: SPageListProps = {
    "/": Home,
    "carga": Carga,
    ...Services.Pages,
}

export default Pages;