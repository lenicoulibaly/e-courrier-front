import React, { useState, useEffect } from 'react';
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
    OutlinedInput,
    TextField,
    Typography,
    Autocomplete
} from '@mui/material';

// project imports
import Modal from '../../../components/commons/Modal';
import FloatingAlert from '../../../components/commons/FloatingAlert';
import { useVisibleStructures } from '../../../hooks/query/useStructures';
import { useUpdateUser } from '../../../hooks/query/useUsers';

// ==============================|| EDIT USER MODAL ||============================== //

const EditUserModal = ({ open, handleClose, user }) => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        userId: '',
        email: '',
        firstName: '',
        lastName: '',
        tel: '',
        strId: null
    });
    const [errors, setErrors] = useState({});
    const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);
    const [isUpdateError, setIsUpdateError] = useState(false);
    const [updateErrorMessage, setUpdateErrorMessage] = useState('');

    // Fetch structures for dropdown
    const { data: structures, isLoading: isLoadingStructures } = useVisibleStructures();

    // Mutation for updating a user
    const updateUserMutation = useUpdateUser();

    // Initialize form with user data
    useEffect(() => {
        if (user) {
            setFormData({
                userId: user.userId,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                tel: user.tel,
                strId: user.strId
            });
        }
    }, [user]);

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

    // Find the selected structure object
    const selectedStructure = structures?.find(s => s.strId === formData.strId) || null;

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName) newErrors.firstName = 'Le prénom est requis';
        if (!formData.lastName) newErrors.lastName = 'Le nom est requis';
        if (!formData.tel) newErrors.tel = 'Le téléphone est requis';
        if (!formData.strId) newErrors.strId = 'La structure est requise';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                await updateUserMutation.mutateAsync(formData);
                queryClient.invalidateQueries('users');
                setIsUpdateSuccess(true);
                setIsUpdateError(false);
            } catch (error) {
                console.error('Error updating user:', error);
                setIsUpdateError(true);
                setIsUpdateSuccess(false);
                // Handle API errors
                if (error.response?.data) {
                    const errorMessage = typeof error.response.data === 'object' 
                        ? error.response.data.message || JSON.stringify(error.response.data) 
                        : error.response.data;
                    setUpdateErrorMessage(errorMessage);
                    setErrors({
                        ...errors,
                        submit: errorMessage
                    });
                } else {
                    setUpdateErrorMessage('Une erreur est survenue lors de la mise à jour de l\'utilisateur');
                    setErrors({
                        ...errors,
                        submit: 'Une erreur est survenue lors de la mise à jour de l\'utilisateur'
                    });
                }
            }
        }
    };

    return (
        <Modal
            open={open}
            handleClose={handleClose}
            title="Modifier l'utilisateur"
            maxWidth="md"
            actionDisabled={!!updateUserMutation.isLoading}
            handleConfirmation={handleSubmit}
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
                    <FormControl fullWidth>
                        <InputLabel htmlFor="email">Email</InputLabel>
                        <OutlinedInput
                            id="email"
                            name="email"
                            label="Email"
                            value={formData.email}
                            disabled
                        />
                        <FormHelperText>L'email ne peut pas être modifié</FormHelperText>
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
                            value={selectedStructure}
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

                {/* Error message */}
                {errors.submit && (
                    <Grid item xs={12}>
                        <FormHelperText error>{errors.submit}</FormHelperText>
                    </Grid>
                )}
            </Grid>
            <FloatingAlert 
                open={isUpdateError || isUpdateSuccess} 
                feedBackMessages={isUpdateError ? updateErrorMessage : isUpdateSuccess ? 'Utilisateur modifié avec succès' : ''} 
                severity={isUpdateError ? 'error' : isUpdateSuccess ? 'success' : 'info'}
            />
        </Modal>
    );
};

EditUserModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
};

export default EditUserModal;
