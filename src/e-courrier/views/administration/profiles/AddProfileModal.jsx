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
import { useCreateProfile, useRoles, usePrivilegesByRoleCodes } from '../../../hooks/query/useAuthorities';
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

// ==============================|| ADD PROFILE MODAL ||============================== //

const AddProfileModal = ({ open, handleClose }) => {
    // State for selected roles
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [roleCodes, setRoleCodes] = useState([]);

    // Update roleCodes when selectedRoles changes
    useEffect(() => {
        if (selectedRoles && selectedRoles.length > 0) {
            setRoleCodes(selectedRoles.map(role => role.code));
        } else {
            setRoleCodes([]);
        }
    }, [selectedRoles]);

    // Mutation for creating a new profile
    const { mutate: createProfile, isPending: isCreating, isSuccess: isCreateSuccess, isError: isCreateError, error: createError } = useCreateProfile();

    // Fetch roles
    const { data: rolesData, isLoading: isLoadingRoles } = useRoles();
    const roles = rolesData?.content || [];

    // Fetch privileges based on selected roles
    const { data: privileges, isLoading: isLoadingPrivileges } = usePrivilegesByRoleCodes(roleCodes);

    // Initial form values
    const initialValues = {
        code: '',
        name: '',
        description: '',
        typeCode: "PRFL",
        children: []
    };

    // Handle form submission
    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        // Transform children to the expected format
        const formattedValues = {
            ...values,
            children: values.children.map(child => ({ code: child.code }))
        };

        createProfile(formattedValues, {
            onSuccess: () => {
                setSubmitting(false);
                resetForm();
                setSelectedRoles([]);
            },
            onError: (error) => {
                console.error('Error creating profile:', error.response?.data);
                setSubmitting(false);
            }
        });
    };

    return (
        <Modal
            open={open}
            handleClose={handleClose}
            title="Création d'un nouveau profil"
            width="md"
            actionLabel="Enregistrer"
            actionDisabled={isCreating}
            handleConfirmation={() => {
                document.getElementById('add-profile-form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            }}
        >
            <Formik initialValues={initialValues} validationSchema={ProfileSchema} onSubmit={handleSubmit}>
                {({ errors, touched, handleChange, handleBlur, values, setFieldValue, isSubmitting }) => (
                    <Form id="add-profile-form">
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
                                    onChange={(event, newValue) => {
                                        setSelectedRoles(newValue);
                                        setFieldValue('children', newValue);
                                    }}
                                    loading={isLoadingRoles}
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
                                                        {isLoadingRoles ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
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
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Privilèges associés
                                </Typography>
                                <Autocomplete
                                    multiple
                                    id="privileges-add"
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
                open={isCreateError || isCreateSuccess} 
                feedBackMessages={isCreateError ? createError?.response?.data : isCreateSuccess ? 'Profil créé avec succès' : ''} 
                severity={isCreateError ? 'error' : isCreateSuccess ? 'success' : 'info'}
            />
            <SimpleBackdrop open={isCreating}/>
        </Modal>
    );
};

AddProfileModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired
};

export default AddProfileModal;
