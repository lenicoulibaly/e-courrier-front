import React, { useState, useEffect } from 'react';

// material-ui
import {
    Button,
    FormControl,
    Grid,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Tooltip,
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import ProfilesList from './ProfilesList';
import AddProfileModal from './AddProfileModal';
import EditProfileModal from './EditProfileModal';
import ViewProfileModal from './ViewProfileModal';

// assets
import { IconSearch } from '@tabler/icons-react';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';

// ==============================|| PROFILES MANAGEMENT ||============================== //

const ProfilesManagement = () => {
    const [, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);

    useEffect(() => {
        setLoading(false);
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleAddProfile = () => {
        setOpenAddModal(true);
    };

    const handleEditProfile = (profile) => {
        setSelectedProfile(profile);
        setOpenEditModal(true);
    };

    const handleViewProfile = (profile) => {
        setSelectedProfile(profile);
        setOpenViewModal(true);
    };

    const handleCloseAddModal = () => {
        setOpenAddModal(false);
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setSelectedProfile(null);
    };

    const handleCloseViewModal = () => {
        setOpenViewModal(false);
        setSelectedProfile(null);
    };

    const theme = useTheme();

    return (
        <MainCard title="Gestion des profils">
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6} md={6}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="search-profiles">Recherche</InputLabel>
                                <OutlinedInput size={'small'}
                                    id="search-profiles"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    placeholder="Rechercher des profils..."
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <IconSearch stroke={1.5} size="1rem" />
                                        </InputAdornment>
                                    }
                                    label="Recherche"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Tooltip title="Ajout d'un nouveau profil" placement="top" arrow>
                                <Button
                                    variant="contained"
                                    onClick={handleAddProfile}
                                    sx={{ minWidth: '40px', width: '40px', height: '40px', padding: 0, backgroundColor:theme.palette.secondary.main }}
                                >
                                    <AddIcon />
                                </Button>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <ProfilesList 
                        searchTerm={searchTerm}
                        onEditProfile={handleEditProfile}
                        onViewProfile={handleViewProfile}
                    />
                </Grid>
            </Grid>

            {/* Add Profile Modal */}
            <AddProfileModal open={openAddModal} handleClose={handleCloseAddModal} />

            {/* Edit Profile Modal */}
            {selectedProfile && (
                <EditProfileModal 
                    open={openEditModal} 
                    handleClose={handleCloseEditModal} 
                    profile={selectedProfile} 
                />
            )}

            {/* View Profile Modal */}
            {selectedProfile && (
                <ViewProfileModal 
                    open={openViewModal} 
                    handleClose={handleCloseViewModal} 
                    profile={selectedProfile} 
                />
            )}
        </MainCard>
    );
};

export default ProfilesManagement;