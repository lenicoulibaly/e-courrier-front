// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconClipboardList, IconCreditCard, IconMapPin, IconHome2 } from '@tabler/icons-react';

// constant
const icons = {
    IconClipboardList,
    IconCreditCard,
    IconMapPin,
    IconHome2
};

// ==============================|| PROJECTS MENU ITEMS ||============================== //

const projects = {
    id: 'projects',
    title: 'Gestion de projets',
    type: 'collapse',
    icon: icons.IconClipboardList,
    children: [
        {
            id: 'pret-scolaire',
            title: 'Prêt Scolaire',
            type: 'item',
            icon: icons.IconCreditCard,
            url: '/projects/pret-scolaire',
            tooltip: 'Gestion des prêts scolaires'
        },
        {
            id: 'acquisition-terrain',
            title: 'Acquisition de terrain',
            type: 'item',
            icon: icons.IconMapPin,
            url: '/projects/acquisition-terrain',
            tooltip: 'Gestion des acquisitions de terrain'
        },
        {
            id: 'acquisition-logement',
            title: 'Acquisition de logoment',
            type: 'item',
            icon: icons.IconHome2,
            url: '/projects/acquisition-logement',
            tooltip: 'Gestion des acquisitions de logement'
        }
    ]
};

export default projects;
