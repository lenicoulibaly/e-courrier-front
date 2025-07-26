// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconSettings, IconCategory, IconShield, IconUserCircle, IconUser, IconUsers, IconUserCheck } from '@tabler/icons-react';

// constant
const icons = {
    IconSettings,
    IconCategory,
    IconShield,
    IconUserCircle,
    IconUser,
    IconUsers,
    IconUserCheck
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
            icon: icons.IconCategory,
            url: '/administration/types'
        },
        {
            id: 'privileges',
            title: <FormattedMessage id="privileges" />,
            type: 'item',
            icon: icons.IconShield,
            url: '/administration/privileges'
        },
        {
            id: 'roles',
            title: <FormattedMessage id="roles" />,
            type: 'item',
            icon: icons.IconUserCircle,
            url: '/administration/roles'
        },
        {
            id: 'profiles',
            title: <FormattedMessage id="profiles" />,
            type: 'item',
            icon: icons.IconUser,
            url: '/administration/profiles'
        },
        {
            id: 'users',
            title: <FormattedMessage id="users" />,
            type: 'item',
            icon: icons.IconUsers,
            url: '/administration/users'
        },
        {
            id: 'user-profiles',
            title: "Assignations de profils",
            type: 'item',
            icon: icons.IconUserCheck,
            url: '/administration/user-profiles'
        }
    ]
};

export default administration;
