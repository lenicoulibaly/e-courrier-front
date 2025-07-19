import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// material-ui
import {
    Button,
    Chip,
    Grid,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    CircularProgress,
    Box
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useProfilesByUser } from '../../../hooks/query/useAuthorities';
import Pagination from '../../../components/commons/Pagination';
import CustomAlertDialog from '../../../components/commons/CustomAlertDialog';
import AddUserProfileModal from './AddUserProfileModal';
import EditUserProfileModal from './EditUserProfileModal';

// assets
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import AddIcon from '@mui/icons-material/Add';

// ==============================|| USER PROFILES ||============================== //

const UserProfiles = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openRevokeDialog, setOpenRevokeDialog] = useState(false);
    const [openDefaultDialog, setOpenDefaultDialog] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);

    // Fetch user profiles
    const { data: profilesPage, isLoading, isError, error } = useProfilesByUser(userId, {
        page: page,
        size: pageSize,
        key: ''
    });
    const profiles = profilesPage?.content;

    // Handle page change
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    // Handle page size change
    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setPage(0); // Reset to first page when changing page size
    };

    // Handle back button
    const handleBack = () => {
        navigate('/administration/users');
    };

    // Handle add profile
    const handleAddProfile = () => {
        setOpenAddModal(true);
    };

    // Handle edit profile
    const handleEditProfile = (profile) => {
        setSelectedProfile(profile);
        setOpenEditModal(true);
    };

    // Handle revoke profile
    const handleRevokeProfile = (profile) => {
        setSelectedProfile(profile);
        setOpenRevokeDialog(true);
    };

    // Handle set default profile
    const handleSetDefaultProfile = (profile) => {
        setSelectedProfile(profile);
        setOpenDefaultDialog(true);
    };

    // Handle close modals and dialogs
    const handleCloseAddModal = () => {
        setOpenAddModal(false);
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setSelectedProfile(null);
    };

    const handleCloseRevokeDialog = () => {
        setOpenRevokeDialog(false);
        setSelectedProfile(null);
    };

    const handleCloseDefaultDialog = () => {
        setOpenDefaultDialog(false);
        setSelectedProfile(null);
    };

    // Handle confirm actions
    const handleConfirmRevoke = () => {
        // Implement revoke profile logic here
        setOpenRevokeDialog(false);
        setSelectedProfile(null);
    };

    const handleConfirmDefault = () => {
        // Implement set default profile logic here
        setOpenDefaultDialog(false);
        setSelectedProfile(null);
    };

    // Show loading state
    if (isLoading) {
        return (
            <MainCard title="Profils de l'utilisateur">
                <Stack direction="row" justifyContent="center" alignItems="center" sx={{ py: 3 }}>
                    <CircularProgress />
                </Stack>
            </MainCard>
        );
    }

    // Show error state
    if (isError) {
        return (
            <MainCard title="Profils de l'utilisateur">
                <Stack direction="row" justifyContent="center" alignItems="center" sx={{ py: 3 }}>
                    <Typography color="error">Error loading profiles: {error?.message || 'Unknown error'}</Typography>
                </Stack>
            </MainCard>
        );
    }

    return (
        <MainCard 
            title={
                <Stack direction="row" alignItems="center" spacing={1}>
                    <IconButton onClick={handleBack} size="small">
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h3">Profils de l'utilisateur</Typography>
                </Stack>
            }
        >
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Box display="flex" justifyContent="flex-end" mb={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleAddProfile}
                        >
                            Ajouter un profil
                        </Button>
                    </Box>
                </Grid>
                
                <Grid item xs={12}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="user profiles table" size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Profil</TableCell>
                                    <TableCell>Structure</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Date de début</TableCell>
                                    <TableCell>Date de fin</TableCell>
                                    <TableCell>Statut</TableCell>
                                    <TableCell>Par défaut</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {profiles && profiles.length > 0 ? (
                                    profiles.map((profile) => {
                                        const isCurrent = profile.assStatusCode === 'STA_ASS_CUR';
                                        const isRevoked = profile.assStatusCode === 'STA_ASS_INACT';
                                        
                                        return (
                                            <TableRow
                                                key={profile.id}
                                                sx={{
                                                    '&:last-child td, &:last-child th': { border: 0 },
                                                    backgroundColor: isRevoked 
                                                        ? alpha(theme.palette.grey[300], 0.3)
                                                        : isCurrent 
                                                            ? alpha(theme.palette.primary.light, 0.1)
                                                            : 'inherit'
                                                }}
                                            >
                                                <TableCell>
                                                    <Typography variant="subtitle2">{profile.profileName}</Typography>
                                                    <Typography variant="caption" color="textSecondary">{profile.profileCode}</Typography>
                                                </TableCell>
                                                <TableCell>{profile.strName}</TableCell>
                                                <TableCell>{profile.userProfileAssTypeName}</TableCell>
                                                <TableCell>{new Date(profile.startingDate).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    {profile.endingDate ? new Date(profile.endingDate).toLocaleDateString() : '-'}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={profile.assStatusName} 
                                                        size="small"
                                                        color={isRevoked ? 'error' : isCurrent ? 'success' : 'default'}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    {isCurrent ? <StarIcon color="warning" /> : <StarBorderIcon />}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Stack direction="row" spacing={1} justifyContent="center">
                                                        <IconButton 
                                                            size="small" 
                                                            color="primary"
                                                            onClick={() => handleEditProfile(profile)}
                                                            disabled={isRevoked}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                        {!isRevoked && (
                                                            <IconButton 
                                                                size="small" 
                                                                color="error"
                                                                onClick={() => handleRevokeProfile(profile)}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        )}
                                                        {!isRevoked && !isCurrent && (
                                                            <IconButton 
                                                                size="small" 
                                                                color="warning"
                                                                onClick={() => handleSetDefaultProfile(profile)}
                                                            >
                                                                <StarIcon fontSize="small" />
                                                            </IconButton>
                                                        )}
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">
                                            <Typography variant="subtitle1">Aucun profil trouvé</Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                
                {/* Pagination */}
                {profilesPage && (
                    <Grid item xs={12}>
                        <Pagination
                            page={page}
                            count={profilesPage.totalPages}
                            rowsPerPage={pageSize}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handlePageSizeChange}
                            totalCount={profilesPage.totalElements}
                        />
                    </Grid>
                )}
            </Grid>

            {/* Add Profile Modal */}
            <AddUserProfileModal 
                open={openAddModal} 
                handleClose={handleCloseAddModal} 
                userId={userId}
            />

            {/* Edit Profile Modal */}
            {selectedProfile && (
                <EditUserProfileModal 
                    open={openEditModal} 
                    handleClose={handleCloseEditModal} 
                    profile={selectedProfile}
                />
            )}

            {/* Revoke Profile Dialog */}
            <CustomAlertDialog
                open={openRevokeDialog}
                handleClose={handleCloseRevokeDialog}
                title="Révoquer le profil"
                content={`Êtes-vous sûr de vouloir révoquer le profil ${selectedProfile?.profileName} ?`}
                confirmBtnText="Révoquer"
                cancelBtnText="Annuler"
                handleConfirm={handleConfirmRevoke}
            />

            {/* Set Default Profile Dialog */}
            <CustomAlertDialog
                open={openDefaultDialog}
                handleClose={handleCloseDefaultDialog}
                title="Définir comme profil par défaut"
                content={`Êtes-vous sûr de vouloir définir ${selectedProfile?.profileName} comme profil par défaut ?`}
                confirmBtnText="Confirmer"
                cancelBtnText="Annuler"
                handleConfirm={handleConfirmDefault}
            />
        </MainCard>
    );
};

export default UserProfiles;