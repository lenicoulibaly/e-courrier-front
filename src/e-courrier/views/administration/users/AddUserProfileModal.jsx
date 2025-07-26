import React, { useState } from 'react';
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
import FloatingAlert from '../../../components/commons/FloatingAlert';
import { useVisibleStructures } from '../../../hooks/query/useStructures';
import { useAllProfiles } from '../../../hooks/query/useAuthorities';
import { useTypesByGroupCode } from '../../../hooks/query/useTypes';
import { useAddProfileToUser } from '../../../hooks/query/useAuthorities';

// ==============================|| ADD USER PROFILE MODAL ||============================== //

const AddUserProfileModal = ({ open, handleClose, userId, user: propUser }) => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        userId: userId,
        profileCode: '',
        strId: '',
        userProfileAssTypeCode: '',
        startingDate: new Date(),
        endingDate: null
    });
    const [errors, setErrors] = useState({});
    const [isCreateSuccess, setIsCreateSuccess] = useState(false);
    const [isCreateError, setIsCreateError] = useState(false);
    const [createErrorMessage, setCreateErrorMessage] = useState('');

    // Use user from props if available
    const [user] = useState(propUser);

    // Fetch data for dropdowns
    const { data: structures, isLoading: isLoadingStructures } = useVisibleStructures();
    const { data: profiles, isLoading: isLoadingProfiles } = useAllProfiles();
    const { data: profileTypes, isLoading: isLoadingProfileTypes } = useTypesByGroupCode('USR_PRFL_TYPE');

    // Mutation for adding a profile
    const addProfileMutation = useAddProfileToUser();

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
                await addProfileMutation.mutateAsync(formData);
                queryClient.invalidateQueries(['userProfiles', userId]);
                setIsCreateSuccess(true);
                setIsCreateError(false);
            } catch (error) {
                setIsCreateError(true);
                setIsCreateSuccess(false);
                // Handle API errors
                if (error.response?.data) {
                    const errorMessage = typeof error.response.data === 'object' 
                        ? error.response.data.message || JSON.stringify(error.response.data) 
                        : error.response.data;
                    setCreateErrorMessage(errorMessage);
                    setErrors({
                        ...errors,
                        submit: errorMessage
                    });
                } else {
                    setCreateErrorMessage('Une erreur est survenue lors de l\'ajout du profil');
                    setErrors({
                        ...errors,
                        submit: 'Une erreur est survenue lors de l\'ajout du profil'
                    });
                }
            }
        }
    };

    return (
        <Modal
            open={open}
            handleClose={handleClose}
            title={user ? `Ajouter un profil pour ${user.lastName}, ${user.firstName} (${user.email})` : "Ajouter un profil"}
            maxWidth="md"
            handleConfirmation={handleSubmit}
            actionDisabled={!!addProfileMutation.isLoading}
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
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    error: Boolean(errors.startingDate),
                                    helperText: errors.startingDate
                                }
                            }}
                        />
                    </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                        <DatePicker
                            label="Date de fin (optionnelle)"
                            value={formData.endingDate}
                            onChange={handleEndDateChange}
                            slotProps={{
                                textField: {
                                    fullWidth: true
                                }
                            }}
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
            <FloatingAlert 
                open={isCreateError || isCreateSuccess} 
                feedBackMessages={isCreateError ? createErrorMessage : isCreateSuccess ? 'Profil ajouté avec succès' : ''} 
                severity={isCreateError ? 'error' : isCreateSuccess ? 'success' : 'info'}
            />
        </Modal>
    );
};

AddUserProfileModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    user: PropTypes.object
};

export default AddUserProfileModal;
