// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconCoin, IconSchool, IconBuildingEstate, IconHome } from '@tabler/icons-react';

// constant
const icons = {
    IconCoin,
    IconSchool,
    IconBuildingEstate,
    IconHome
};

// ==============================|| COMPTABILITE MENU ITEMS ||============================== //

const comptabilite = {
    id: 'comptabilite',
    title: 'Comptabilité',
    type: 'collapse',
    icon: icons.IconCoin,
    children: [
        {
            id: 'cotisations',
            title: 'Cotisations',
            type: 'item',
            icon: icons.IconCoin,
            url: '/comptabilite/cotisations',
            tooltip: 'Gestion des cotisations'
        },
        {
            id: 'prets-scolaires',
            title: 'Prêts scolaires',
            type: 'item',
            icon: icons.IconSchool,
            url: '/comptabilite/prets-scolaires',
            tooltip: 'Gestion des prêts scolaires'
        },
        {
            id: 'acquisition-terrain',
            title: 'Acquition terrain',
            type: 'item',
            icon: icons.IconBuildingEstate,
            url: '/comptabilite/acquisition-terrain',
            tooltip: 'Gestion des acquisitions de terrain'
        },
        {
            id: 'acquisition-logement',
            title: 'Acquition logement',
            type: 'item',
            icon: icons.IconHome,
            url: '/comptabilite/acquisition-logement',
            tooltip: 'Gestion des acquisitions de logement'
        }
    ]
};

export default comptabilite;