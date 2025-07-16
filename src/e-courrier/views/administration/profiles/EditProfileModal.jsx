import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

// material-ui
import {
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Autocomplete,
    CircularProgress,
    Chip,
    Box,
    Typography,
} from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import { useUpdateProfile, useRoles, useRolesByProfile, usePrivilegesByRoleCodes } from '../../../hooks/query/useAuthorities';
import Modal from '../../../components/commons/Modal';
import FloatingAlert from '../../../components/commons/FloatingAlert';
import SimpleBackdrop from '../../../components/commons/SimpleBackdrop';

// validation schema
const ProfileSchema = Yup.object().shape({
    code: Yup.string()
        .required('Le code est requis')
        .max(50, 'La taille du code ne peut excéder 50 caractères'),
    name: Yup.string()
        .required('Le nom est obligatoire')
        .max(100, 'La taille du nom ne peut excéder 100 caractères'),
    description: Yup.string()
        .max(255, 'La description ne peut excéder 255 caractères'),
    children: Yup.array()
        .of(
            Yup.object().shape({
                code: Yup.string().required('Le code du rôle est requis')
            })
        )
});

// ==============================|| EDIT PROFILE MODAL ||============================== //

const EditProfileModal = ({ open, handleClose, profile }) => {
    // State for selected roles
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [roleCodes, setRoleCodes] = useState([]);
    const [initialRoleCodes, setInitialRoleCodes] = useState([]);

    // Update roleCodes when selectedRoles changes
    useEffect(() => {
        if (selectedRoles && selectedRoles.length > 0) {
            setRoleCodes(selectedRoles.map(role => role.code));
        } else {
            setRoleCodes([]);
        }
    }, [selectedRoles]);

    // Mutation for updating a profile
    const { mutate: updateProfile, isPending: isUpdating, isSuccess: isUpdateSuccess, isError: isUpdateError, error: updateError } = useUpdateProfile();

    // Fetch roles
    const { data: rolesData, isLoading: isLoadingRoles } = useRoles();
    const roles = rolesData?.content || [];

    // Fetch roles by profile
    const { data: profileRoles, isLoading: isLoadingProfileRoles } = useRolesByProfile(profile?.code);

    // Set initial roles when profile roles are loaded
    useEffect(() => {
        if (profileRoles ) {
            setSelectedRoles(profileRoles);
            setInitialRoleCodes(profileRoles.map(role => role.code));
        }
    }, [profileRoles]);

    // Fetch privileges based on selected roles
    const { data: privileges, isLoading: isLoadingPrivileges } = usePrivilegesByRoleCodes(roleCodes);

    // Initial form values
    const initialValues = {
        code: profile?.code || '',
        name: profile?.name || '',
        profileCode: profile?.code || '',
        description: profile?.description || '',
        typeCode: "PRFL",
        children: profileRoles || []
    };

    // Handle form submission
    const handleSubmit = (values, { setSubmitting }) => {
        // Transform children to the expected format
        const formattedValues = {
            ...values,
            children: values.children.map(child => ({ code: child.code }))
        };

        updateProfile(formattedValues, {
            onSuccess: () => {
                setSubmitting(false);
                handleClose();
            },
            onError: (error) => {
                console.error('Error updating profile:', error.response?.data);
                setSubmitting(false);
            }
        });
    };

    // Custom styling for preselected roles
    const getOptionStyles = (option, { selected }) => {
        const isPreselected = initialRoleCodes.includes(option.code);

        return {
            fontWeight: isPreselected ? 700 : 400,
            color: isPreselected ? '#000' : undefined,
            backgroundColor: selected && !isPreselected ? undefined : 'transparent',
        };
    };

    return (
        <Modal
            open={open}
            handleClose={handleClose}
            title="Modification du profil"
            width="md"
            actionLabel="Enregistrer"
            actionDisabled={isUpdating}
            handleConfirmation={() => {
                document.getElementById('edit-profile-form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            }}
        >
            <Formik 
                initialValues={initialValues} 
                validationSchema={ProfileSchema} 
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ errors, touched, handleChange, handleBlur, values, setFieldValue, isSubmitting }) => (
                    <Form id="edit-profile-form">
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12} md={6}>
                                <Field
                                    size={'small'}
                                    as={TextField}
                                    fullWidth
                                    id="code"
                                    name="code"
                                    label="Code"
                                    value={values.code}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.code && Boolean(errors.code)}
                                    helperText={touched.code && errors.code}
                                    disabled // Code should not be editable
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Field
                                    size={'small'}
                                    as={TextField}
                                    fullWidth
                                    id="name"
                                    name="name"
                                    label="Nom"
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.name && Boolean(errors.name)}
                                    helperText={touched.name && errors.name}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    size={'small'}
                                    as={TextField}
                                    fullWidth
                                    id="description"
                                    name="description"
                                    label="Description"
                                    multiline
                                    rows={3}
                                    value={values.description}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.description && Boolean(errors.description)}
                                    helperText={touched.description && errors.description}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Rôles
                                </Typography>
                                <Autocomplete disableCloseOnSelect
                                    multiple
                                    id="roles-select"
                                    options={roles || []}
                                    getOptionLabel={(option) => `${option.code} - ${option.name}`}
                                    value={selectedRoles}
                                    isOptionEqualToValue={(option, value) => option.code === value.code}
                                    onChange={(event, newValue) => {
                                        setSelectedRoles(newValue);
                                        setFieldValue('children', newValue);
                                    }}
                                    loading={isLoadingRoles || isLoadingProfileRoles}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            size="small"
                                            label="Rôles"
                                            placeholder="Sélectionner des rôles"
                                            error={touched.children && Boolean(errors.children)}
                                            helperText={touched.children && errors.children}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {(isLoadingRoles || isLoadingProfileRoles) ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => {
                                            const isPreselected = initialRoleCodes.includes(option.code);
                                            return (
                                                <Chip
                                                    label={`${option.code} - ${option.name}`}
                                                    size="small"
                                                    {...getTagProps({ index })}
                                                    sx={{
                                                        fontWeight: isPreselected ? 700 : 400,
                                                        color: isPreselected ? '#000' : undefined,
                                                    }}
                                                />
                                            );
                                        })
                                    }
                                    renderOption={(props, option, { selected }) => {
                                        const isPreselected = initialRoleCodes.includes(option.code);
                                        return (
                                            <li 
                                                {...props} 
                                                style={{
                                                    fontWeight: isPreselected ? 700 : 400,
                                                    color: isPreselected ? '#000' : undefined,
                                                    backgroundColor: selected && !isPreselected ? undefined : 'transparent',
                                                }}
                                            >
                                                {`${option.code} - ${option.name}`}
                                            </li>
                                        );
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Privilèges associés
                                </Typography>
                                <Autocomplete
                                    multiple
                                    id="privileges-edit"
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
                                            placeholder="Les privilèges associés aux rôles sélectionnés s'afficheront ici"
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
                    </Form>
                )}
            </Formik>
            <FloatingAlert 
                open={isUpdateError || isUpdateSuccess} 
                feedBackMessages={isUpdateError ? updateError?.response?.data : isUpdateSuccess ? 'Profil mis à jour avec succès' : ''} 
                severity={isUpdateError ? 'error' : isUpdateSuccess ? 'success' : 'info'}
            />
            <SimpleBackdrop open={isUpdating}/>
        </Modal>
    );
};

EditProfileModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
};

export default EditProfileModal;
