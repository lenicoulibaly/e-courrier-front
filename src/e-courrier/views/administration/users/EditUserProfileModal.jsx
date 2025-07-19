import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQueryClient } from '@tanstack/react-query';

// material-ui
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { fr } from 'date-fns/locale';

// project imports
import Modal from '../../../components/commons/Modal';
import { useVisibleStructures } from '../../../hooks/query/useStructures';
import { useAllProfiles } from '../../../hooks/query/useAuthorities';
import { useTypesByGroupCode } from '../../../hooks/query/useTypes';
import { useUpdateUserProfile } from '../../../hooks/query/useAuthorities';

// ==============================|| EDIT USER PROFILE MODAL ||============================== //

const EditUserProfileModal = ({ open, handleClose, profile }) => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        id: '',
        userId: '',
        profileCode: '',
        strId: '',
        userProfileAssTypeCode: '',
        startingDate: new Date(),
        endingDate: null
    });
    const [errors, setErrors] = useState({});

    // Fetch data for dropdowns
    const { data: structures, isLoading: isLoadingStructures } = useVisibleStructures();
    const { data: profiles, isLoading: isLoadingProfiles } = useAllProfiles();
    const { data: profileTypes, isLoading: isLoadingProfileTypes } = useTypesByGroupCode('USR_PRFL_TYPE');

    // Mutation for updating a profile
    const updateProfileMutation = useUpdateUserProfile();

    // Initialize form with profile data
    useEffect(() => {
        if (profile) {
            setFormData({
                id: profile.id,
                userId: profile.userId,
                profileCode: profile.profileCode,
                strId: profile.strId,
                userProfileAssTypeCode: profile.userProfileAssTypeCode,
                startingDate: profile.startingDate ? new Date(profile.startingDate) : new Date(),
                endingDate: profile.endingDate ? new Date(profile.endingDate) : null
            });
        }
    }, [profile]);

    // Handle form input changes
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
        // Clear error for this field
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    // Handle date changes
    const handleStartDateChange = (date) => {
        setFormData({
            ...formData,
            startingDate: date
        });
        // Clear error for this field
        if (errors.startingDate) {
            setErrors({
                ...errors,
                startingDate: null
            });
        }
    };

    const handleEndDateChange = (date) => {
        setFormData({
            ...formData,
            endingDate: date
        });
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.profileCode) newErrors.profileCode = 'Le profil est requis';
        if (!formData.strId) newErrors.strId = 'La structure est requise';
        if (!formData.userProfileAssTypeCode) newErrors.userProfileAssTypeCode = 'Le type de profil est requis';
        if (!formData.startingDate) newErrors.startingDate = 'La date de début est requise';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                await updateProfileMutation.mutateAsync(formData);
                queryClient.invalidateQueries(['userProfiles', formData.userId]);
                handleClose();
            } catch (error) {
                console.error('Error updating profile:', error);
                // Handle API errors
                if (error.response?.data?.message) {
                    setErrors({
                        ...errors,
                        submit: error.response.data.message
                    });
                } else {
                    setErrors({
                        ...errors,
                        submit: 'Une erreur est survenue lors de la mise à jour du profil'
                    });
                }
            }
        }
    };

    return (
        <Modal
            open={open}
            handleClose={handleClose}
            title="Modifier le profil"
            maxWidth="md"
            actions={
                <Box display="flex" justifyContent="flex-end" gap={1}>
                    <Button variant="outlined" color="secondary" onClick={handleClose}>
                        Annuler
                    </Button>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleSubmit}
                        disabled={updateProfileMutation.isLoading}
                    >
                        {updateProfileMutation.isLoading ? 'Mise à jour en cours...' : 'Mettre à jour'}
                    </Button>
                </Box>
            }
        >
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={Boolean(errors.profileCode)}>
                        <InputLabel id="profile-label">Profil</InputLabel>
                        <Select
                            labelId="profile-label"
                            id="profileCode"
                            name="profileCode"
                            value={formData.profileCode}
                            label="Profil"
                            onChange={handleChange}
                        >
                            {profiles?.map((profile) => (
                                <MenuItem key={profile.code} value={profile.code}>
                                    {profile.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.profileCode && (
                            <FormHelperText error>{errors.profileCode}</FormHelperText>
                        )}
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={Boolean(errors.strId)}>
                        <InputLabel id="structure-label">Structure</InputLabel>
                        <Select
                            labelId="structure-label"
                            id="strId"
                            name="strId"
                            value={formData.strId}
                            label="Structure"
                            onChange={handleChange}
                        >
                            {structures?.map((structure) => (
                                <MenuItem key={structure.strId} value={structure.strId}>
                                    {structure.strName}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.strId && (
                            <FormHelperText error>{errors.strId}</FormHelperText>
                        )}
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={Boolean(errors.userProfileAssTypeCode)}>
                        <InputLabel id="profile-type-label">Type de profil</InputLabel>
                        <Select
                            labelId="profile-type-label"
                            id="userProfileAssTypeCode"
                            name="userProfileAssTypeCode"
                            value={formData.userProfileAssTypeCode}
                            label="Type de profil"
                            onChange={handleChange}
                        >
                            {profileTypes?.map((type) => (
                                <MenuItem key={type.code} value={type.code}>
                                    {type.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.userProfileAssTypeCode && (
                            <FormHelperText error>{errors.userProfileAssTypeCode}</FormHelperText>
                        )}
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                        <DatePicker
                            label="Date de début"
                            value={formData.startingDate}
                            onChange={handleStartDateChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    error={Boolean(errors.startingDate)}
                                    helperText={errors.startingDate}
                                />
                            )}
                        />
                    </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                        <DatePicker
                            label="Date de fin (optionnelle)"
                            value={formData.endingDate}
                            onChange={handleEndDateChange}
                            renderInput={(params) => (
                                <TextField {...params} fullWidth />
                            )}
                        />
                    </LocalizationProvider>
                </Grid>

                {/* Error message */}
                {errors.submit && (
                    <Grid item xs={12}>
                        <Typography color="error">{errors.submit}</Typography>
                    </Grid>
                )}
            </Grid>
        </Modal>
    );
};

EditUserProfileModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
};

export default EditUserProfileModal;
