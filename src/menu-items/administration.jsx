// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconSettings, IconCategory, IconShield, IconUserCircle, IconUser, IconUsers, IconUserCheck, IconBuildingSkyscraper } from '@tabler/icons-react';

// constant
const icons = {
    IconSettings,
    IconCategory,
    IconShield,
    IconUserCircle,
    IconUser,
    IconUsers,
    IconUserCheck,
    IconBuildingSkyscraper
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
            url: '/administration/types',
            tooltip: 'Gestion des types'
        },
        {
            id: 'privileges',
            title: <FormattedMessage id="privileges" />,
            type: 'item',
            icon: icons.IconShield,
            url: '/administration/privileges',
            tooltip: 'Gestion des privilèges'
        },
        {
            id: 'roles',
            title: <FormattedMessage id="roles" />,
            type: 'item',
            icon: icons.IconUserCircle,
            url: '/administration/roles',
            tooltip: 'Gestion des rôles'
        },
        {
            id: 'profiles',
            title: <FormattedMessage id="profiles" />,
            type: 'item',
            icon: icons.IconUser,
            url: '/administration/profiles',
            tooltip: 'Gestion des profils'
        },
        {
            id: 'users',
            title: <FormattedMessage id="users" />,
            type: 'item',
            icon: icons.IconUsers,
            url: '/administration/users',
            tooltip: 'Gestion des utilisateurs'
        },
        {
            id: 'user-profiles',
            title: "Assignations de profils",
            type: 'item',
            icon: icons.IconUserCheck,
            url: '/administration/user-profiles',
            tooltip: 'Gestion des assignations de profils'
        },
        {
            id: 'structures',
            title: "Structures",
            type: 'item',
            icon: icons.IconBuildingSkyscraper,
            url: '/administration/structures',
            tooltip: 'Gestion des structures'
        }
    ]
};

export default administration;
