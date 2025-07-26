import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import {
    Autocomplete,
    Button,
    FormControl,
    Grid,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Tooltip,
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import UsersList from './UsersList';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';
import ViewUserModal from './ViewUserModal';
import { useVisibleStructures } from '../../../hooks/query/useStructures';
import { useVisibleUsers } from '../../../hooks/query/useUsers';

// assets
import { IconSearch } from '@tabler/icons-react';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';

// ==============================|| USERS MANAGEMENT ||============================== //

const UsersManagement = () => {
    const [, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUserFilter, setSelectedUserFilter] = useState(null);
    const [selectedStructure, setSelectedStructure] = useState(null);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();

    // Fetch structures for the filter
    const { data: structures, isLoading: isLoadingStructures } = useVisibleStructures();

    // Fetch visible users for the autocomplete
    const { data: visibleUsers, isLoading: isLoadingUsers } = useVisibleUsers();

    useEffect(() => {
        setLoading(false);
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setSelectedUserFilter(null); // Reset user filter when typing in search
    };

    const handleUserFilterChange = (event, newValue) => {
        setSelectedUserFilter(newValue);
        // If a user is selected, clear the search term
        if (newValue) {
            setSearchTerm('');
        }
    };

    const handleStructureChange = (event, newValue) => {
        setSelectedStructure(newValue);
    };

    const handleAddUser = () => {
        setOpenAddModal(true);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setOpenEditModal(true);
    };

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setOpenViewModal(true);
    };

    const handleViewUserProfiles = (userId, user) => {
        navigate(`/administration/users/${userId}/profiles`, { state: { user } });
    };

    const handleCloseAddModal = () => {
        setOpenAddModal(false);
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setSelectedUser(null);
    };

    const handleCloseViewModal = () => {
        setOpenViewModal(false);
        setSelectedUser(null);
    };

    const theme = useTheme();

    return (
        <MainCard title="Gestion des utilisateurs">
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6} md={4}>
                            {selectedUserFilter ? (
                                <Autocomplete
                                    id="user-filter"
                                    options={visibleUsers || []}
                                    getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                                    value={selectedUserFilter}
                                    onChange={handleUserFilterChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Filtrer par utilisateur"
                                            size="small"
                                            placeholder="Sélectionner un utilisateur"
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <>
                                                        <InputAdornment position="start">
                                                            <IconSearch stroke={1.5} size="1rem" />
                                                        </InputAdornment>
                                                        {params.InputProps.startAdornment}
                                                    </>
                                                )
                                            }}
                                        />
                                    )}
                                    isOptionEqualToValue={(option, value) => option.userId === value?.userId}
                                />
                            ) : (
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="search-users">Recherche</InputLabel>
                                    <OutlinedInput size={'small'}
                                        id="search-users"
                                        value={searchTerm}
                                        onChange={handleSearch}
                                        placeholder="Rechercher des utilisateurs..."
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <IconSearch stroke={1.5} size="1rem" />
                                            </InputAdornment>
                                        }
                                        label="Recherche"
                                        onFocus={() => {
                                            if (visibleUsers && visibleUsers.length > 0) {
                                                setSelectedUserFilter(null);
                                                setSearchTerm('');
                                            }
                                        }}
                                    />
                                </FormControl>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Autocomplete
                                id="structure-filter"
                                options={structures || []}
                                getOptionLabel={(option) => option.strName || ''}
                                value={selectedStructure}
                                onChange={handleStructureChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Filtrer par structure"
                                        size="small"
                                        placeholder="Sélectionner une structure"
                                    />
                                )}
                                isOptionEqualToValue={(option, value) => option.strId === value?.strId}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Tooltip title="Ajouter un nouvel utilisateur" placement="top" arrow>
                                <Button
                                    variant="contained"
                                    onClick={handleAddUser}
                                    sx={{ minWidth: '40px', width: '40px', height: '40px', padding: 0, backgroundColor: theme.palette.secondary.main }}
                                >
                                    <AddIcon />
                                </Button>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <UsersList 
                        searchTerm={selectedUserFilter ? '' : searchTerm}
                        structureId={selectedStructure?.strId}
                        userId={selectedUserFilter?.userId}
                        onEditUser={handleEditUser}
                        onViewUser={handleViewUser}
                        onViewUserProfiles={handleViewUserProfiles}
                    />
                </Grid>
            </Grid>

            {/* Add User Modal */}
            <AddUserModal open={openAddModal} handleClose={handleCloseAddModal} />

            {/* Edit User Modal */}
            {selectedUser && (
                <EditUserModal 
                    open={openEditModal} 
                    handleClose={handleCloseEditModal} 
                    user={selectedUser} 
                />
            )}

            {/* View User Modal */}
            {selectedUser && (
                <ViewUserModal 
                    open={openViewModal} 
                    handleClose={handleCloseViewModal} 
                    user={selectedUser} 
                />
            )}
        </MainCard>
    );
};

export default UsersManagement;
