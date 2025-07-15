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
        },
        {
            id: 'privileges',
            title: <FormattedMessage id="privileges" />,
            type: 'item',
            icon: icons.IconList,
            url: '/administration/privileges'
        },
        {
            id: 'roles',
            title: <FormattedMessage id="roles" />,
            type: 'item',
            icon: icons.IconList,
            url: '/administration/roles'
        },
        {
            id: 'profiles',
            title: <FormattedMessage id="profiles" />,
            type: 'item',
            icon: icons.IconList,
            url: '/administration/profiles'
        }
    ]
};

export default administration;
