
import Usuario from './Usuario';

import Sland from './Sland';
const Pages = {
    ...Usuario.Pages,
    ...Sland.Pages,
}

const Reducers = {
    ...Usuario.Reducers,
    ...Sland.Reducers,
}

export default {
    Pages,
    Reducers
}