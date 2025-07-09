// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconSettings, IconList } from '@tabler/icons-react';

// constant
const icons = {
    IconSettings,
    IconList
};

// ==============================|| ADMINISTRATION MENU ITEMS ||============================== //

const administration = {
    id: 'administration',
    title: <FormattedMessage id="administration" />,
    type: 'group',
    icon: icons.IconSettings,
    children: [
        {
            id: 'types',
            title: <FormattedMessage id="types" />,
            type: 'item',
            icon: icons.IconList,
            url: '/administration/types'
        }
    ]
};

export default administration;
