// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconBuildingEstate, IconHome } from '@tabler/icons-react';

// constant
const icons = {
    IconBuildingEstate,
    IconHome
};

// ==============================|| IMMOBILIER MENU ITEMS ||============================== //

const immobilier = {
    id: 'immobilier',
    title: 'Gestion immobilière',
    type: 'collapse',
    icon: icons.IconBuildingEstate,
    children: [
        {
            id: 'location-maison',
            title: 'Location maison',
            type: 'item',
            icon: icons.IconHome,
            url: '/immobilier/location-maison',
            tooltip: 'Gestion des locations de maison'
        },
        {
            id: 'vente-maison',
            title: 'Vente maison',
            type: 'item',
            icon: icons.IconHome,
            url: '/immobilier/vente-maison',
            tooltip: 'Gestion des ventes de maison'
        }
    ]
};

export default immobilier;