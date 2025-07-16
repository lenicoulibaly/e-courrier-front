import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// material-ui
import {
    Grid,
    TextField,
    CircularProgress,
    Chip,
    Stack,
    Typography,
    Paper,
    Autocomplete,
} from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import { useRolesByProfile, usePrivilegesByRoleCodes } from '../../../hooks/query/useAuthorities';
import Modal from '../../../components/commons/Modal';

// ==============================|| VIEW PROFILE MODAL ||============================== //

const ViewProfileModal = ({ open, handleClose, profile }) => {
    // State for role codes
    const [roleCodes, setRoleCodes] = useState([]);

    // Fetch roles by profile
    const { data: profileRoles, isLoading: isLoadingProfileRoles } = useRolesByProfile(profile?.code);

    // Update roleCodes when profile roles are loaded
    useEffect(() => {
        if (profileRoles) {
            setRoleCodes(profileRoles.map(role => role.code));
        } else {
            setRoleCodes([]);
        }
    }, [profileRoles]);

    // Fetch privileges based on role codes
    const { data: privileges, isLoading: isLoadingPrivileges } = usePrivilegesByRoleCodes(roleCodes);

    return (
        <Modal
            open={open}
            handleClose={handleClose}
            title="Détails du profil"
            width="md"
            actionVisible={false}
        >
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} md={6}>
                    <TextField
                        size={'small'}
                        fullWidth
                        label="Code"
                        value={profile?.code || ''}
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        size={'small'}
                        fullWidth
                        label="Nom"
                        value={profile?.name || ''}
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        size={'small'}
                        fullWidth
                        label="Description"
                        multiline
                        rows={3}
                        value={profile?.description || ''}
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                        Rôles associés
                    </Typography>
                    {isLoadingProfileRoles ? (
                        <CircularProgress size={24} />
                    ) : profileRoles && profileRoles.length > 0 ? (
                        <Paper variant="outlined" sx={{ p: 2 }}>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                {profileRoles.map((role, index) => (
                                    <Chip
                                        key={index}
                                        label={`${role.code} - ${role.name}`}
                                        size="small"
                                        sx={{ my: 0.5 }}
                                    />
                                ))}
                            </Stack>
                        </Paper>
                    ) : (
                        <Typography variant="body2">Aucun rôle associé</Typography>
                    )}
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                        Privilèges associés
                    </Typography>
                    <Autocomplete
                        multiple
                        id="privileges-view"
                        options={privileges || []}
                        getOptionLabel={(option) => `${option.code} - ${option.name}`}
                        value={privileges || []}
                        readOnly
                        disableClearable
                        loading={isLoadingPrivileges}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                size="small"
                                label="Privilèges"
                                placeholder="Aucun privilège associé"
                                InputProps={{
                                    ...params.InputProps,
                                    readOnly: true,
                                    startAdornment: (
                                        <>
                                            {isLoadingPrivileges ? <CircularProgress color="inherit" size={20} sx={{ mr: 1 }} /> : null}
                                            {params.InputProps.startAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip
                                    label={`${option.code} - ${option.name}`}
                                    size="small"
                                    {...getTagProps({ index })}
                                />
                            ))
                        }
                    />
                </Grid>
            </Grid>
        </Modal>
    );
};

ViewProfileModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
};

export default ViewProfileModal;
