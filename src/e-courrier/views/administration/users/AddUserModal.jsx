import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQueryClient } from '@tanstack/react-query';

// material-ui
import {
    Box,
    Button,
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    Stack,
    TextField,
    Typography,
    Autocomplete
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
import { useCreateUserWithProfile } from '../../../hooks/query/useUsers';

// ==============================|| ADD USER MODAL ||============================== //

const AddUserModal = ({ open, handleClose }) => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        tel: '',
        strId: null,
        profileCode: '',
        userProfileAssTypeCode: '',
        startingDate: new Date(),
        endingDate: null
    });
    const [errors, setErrors] = useState({});
    const [isCreateSuccess, setIsCreateSuccess] = useState(false);
    const [isCreateError, setIsCreateError] = useState(false);
    const [createErrorMessage, setCreateErrorMessage] = useState('');

    // Fetch data for dropdowns
    const { data: structures, isLoading: isLoadingStructures } = useVisibleStructures();
    const { data: profiles, isLoading: isLoadingProfiles } = useAllProfiles();
    const { data: profileTypes, isLoading: isLoadingProfileTypes } = useTypesByGroupCode('USR_PRFL_TYPE');

    // Mutation for creating a user
    const createUserMutation = useCreateUserWithProfile();

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

    // Handle structure selection
    const handleStructureChange = (event, newValue) => {
        setFormData({
            ...formData,
            strId: newValue?.strId || null
        });
        // Clear error for this field
        if (errors.strId) {
            setErrors({
                ...errors,
                strId: null
            });
        }
    };

    // Handle date changes
    const handleStartDateChange = (date) => {
        setFormData({
            ...formData,
            startingDate: date
        });
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

        if (!formData.email) newErrors.email = 'L\'email est requis';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Format d\'email invalide';

        if (!formData.firstName) newErrors.firstName = 'Le prénom est requis';
        if (!formData.lastName) newErrors.lastName = 'Le nom est requis';
        if (!formData.tel) newErrors.tel = 'Le téléphone est requis';
        if (!formData.strId) newErrors.strId = 'La structure est requise';
        if (!formData.profileCode) newErrors.profileCode = 'Le profil est requis';
        if (!formData.userProfileAssTypeCode) newErrors.userProfileAssTypeCode = 'Le type de profil est requis';
        if (!formData.startingDate) newErrors.startingDate = 'La date de début est requise';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                await createUserMutation.mutateAsync(formData);
                queryClient.invalidateQueries('users');
                setIsCreateSuccess(true);
                setIsCreateError(false);
            } catch (error) {
                console.error('Error creating user:', error);
                setIsCreateError(true);
                setIsCreateSuccess(false);
                // Handle API errors
                if (error.response?.data?.message) {
                    setCreateErrorMessage(error.response.data.message);
                    setErrors({
                        ...errors,
                        submit: error.response.data.message
                    });
                } else {
                    setCreateErrorMessage('Une erreur est survenue lors de la création de l\'utilisateur');
                    setErrors({
                        ...errors,
                        submit: 'Une erreur est survenue lors de la création de l\'utilisateur'
                    });
                }
            }
        }
    };

    return (
        <Modal
            open={open}
            handleClose={handleClose}
            title="Ajouter un nouvel utilisateur"
            maxWidth="md"
            handleConfirmation={handleSubmit}
            actionDisabled={!!createUserMutation.isLoading}
        >
            <Grid container spacing={2}>
                {/* General Information Section */}
                <Grid item xs={12}>
                    <Typography variant="h5" gutterBottom>
                        Informations générales
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={Boolean(errors.firstName)}>
                        <InputLabel htmlFor="firstName">Prénom</InputLabel>
                        <OutlinedInput
                            id="firstName"
                            name="firstName"
                            label="Prénom"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                        {errors.firstName && (
                            <FormHelperText error>{errors.firstName}</FormHelperText>
                        )}
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={Boolean(errors.lastName)}>
                        <InputLabel htmlFor="lastName">Nom</InputLabel>
                        <OutlinedInput
                            id="lastName"
                            name="lastName"
                            label="Nom"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                        {errors.lastName && (
                            <FormHelperText error>{errors.lastName}</FormHelperText>
                        )}
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={Boolean(errors.email)}>
                        <InputLabel htmlFor="email">Email</InputLabel>
                        <OutlinedInput
                            id="email"
                            name="email"
                            label="Email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && (
                            <FormHelperText error>{errors.email}</FormHelperText>
                        )}
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={Boolean(errors.tel)}>
                        <InputLabel htmlFor="tel">Téléphone</InputLabel>
                        <OutlinedInput
                            id="tel"
                            name="tel"
                            label="Téléphone"
                            value={formData.tel}
                            onChange={handleChange}
                        />
                        {errors.tel && (
                            <FormHelperText error>{errors.tel}</FormHelperText>
                        )}
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    <FormControl fullWidth error={Boolean(errors.strId)}>
                        <Autocomplete
                            id="structure"
                            options={structures || []}
                            getOptionLabel={(option) => option.strName || ''}
                            onChange={handleStructureChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Structure"
                                    error={Boolean(errors.strId)}
                                    helperText={errors.strId}
                                />
                            )}
                            isOptionEqualToValue={(option, value) => option.strId === value?.strId}
                        />
                    </FormControl>
                </Grid>

                {/* Profile Information Section */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                    <Typography variant="h5" gutterBottom>
                        Profil de l'utilisateur
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                </Grid>

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
                        <FormHelperText error>{errors.submit}</FormHelperText>
                    </Grid>
                )}
            </Grid>
            <FloatingAlert 
                open={isCreateError || isCreateSuccess} 
                feedBackMessages={isCreateError ? createErrorMessage : isCreateSuccess ? 'Utilisateur créé avec succès' : ''} 
                severity={isCreateError ? 'error' : isCreateSuccess ? 'success' : 'info'}
            />
        </Modal>
    );
};

AddUserModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired
};

export default AddUserModal;
