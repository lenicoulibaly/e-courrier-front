import React, { useState } from 'react';
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
import { useCreateRole } from '../../../hooks/query/useAuthorities';
import { useGetPrivilegesListByTypeCodes, useTypesByGroupCode } from '../../../hooks/query';
import Modal from '../../../components/commons/Modal';
import FloatingAlert from '../../../components/commons/FloatingAlert';
import SimpleBackdrop from '../../../components/commons/SimpleBackdrop';

// validation schema
const RoleSchema = Yup.object().shape({
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
                code: Yup.string().required('Le code du privilège est requis')
            })
        )
});

// ==============================|| ADD ROLE MODAL ||============================== //

const AddRoleModal = ({ open, handleClose }) => {
    // State for selected privilege types
    const [selectedPrivilegeTypes, setSelectedPrivilegeTypes] = useState([]);

    // Mutation for creating a new role
    const { mutate: createRole, isPending: isCreating, isSuccess: isCreateSuccess, isError: isCreateError, error: createError } = useCreateRole();

    // Fetch privilege types
    const { data: privilegeTypes, isLoading: isLoadingTypes } = useTypesByGroupCode('PRV');

    // Fetch privileges based on selected privilege types
    const { data: privileges, isLoading: isLoadingPrivileges } = useGetPrivilegesListByTypeCodes({
        privilegeTypeCodes: selectedPrivilegeTypes.map(type => type.code)
    });

    // Initial form values
    const initialValues = {
        code: '',
        name: '',
        description: '',
        typeCode: "ROL",
        children: []
    };

    // Handle form submission
    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        // Transform children to the expected format
        const formattedValues = {
            ...values,
            children: values.children.map(child => ({ code: child.code }))
        };

        createRole(formattedValues, {
            onSuccess: () => {
                setSubmitting(false);
                resetForm();
                setSelectedPrivilegeTypes([]);
            },
            onError: (error) => {
                console.error('Error creating role:', error.response?.data);
                setSubmitting(false);
            }
        });
    };

    return (
        <Modal
            open={open}
            handleClose={handleClose}
            title="Création d'un nouveau rôle"
            width="md"
            actionLabel="Enregistrer"
            actionDisabled={isCreating}
            handleConfirmation={() => {
                document.getElementById('add-role-form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            }}
        >
            <Formik initialValues={initialValues} validationSchema={RoleSchema} onSubmit={handleSubmit}>
                {({ errors, touched, handleChange, handleBlur, values, setFieldValue, isSubmitting }) => (
                    <Form id="add-role-form">
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
                                    Privilèges
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Autocomplete
                                            multiple
                                            id="privilege-types-filter"
                                            options={privilegeTypes || []}
                                            getOptionLabel={(option) => `${option.code} - ${option.name}`}
                                            value={selectedPrivilegeTypes}
                                            onChange={(event, newValue) => {
                                                setSelectedPrivilegeTypes(newValue);
                                            }}
                                            loading={isLoadingTypes}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    size="small"
                                                    label="Types de privilège"
                                                    placeholder="Filtrer par type"
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        endAdornment: (
                                                            <>
                                                                {isLoadingTypes ? <CircularProgress color="inherit" size={20} /> : null}
                                                                {params.InputProps.endAdornment}
                                                            </>
                                                        ),
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Autocomplete disableCloseOnSelect
                                            multiple
                                            id="privileges-select"
                                            options={privileges || []}
                                            getOptionLabel={(option) => `${option.code} - ${option.name}`}
                                            value={values.children}
                                            onChange={(event, newValue) => {
                                                setFieldValue('children', newValue);
                                            }}
                                            loading={isLoadingPrivileges}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    size="small"
                                                    label="Privilèges"
                                                    placeholder="Sélectionner des privilèges"
                                                    error={touched.children && Boolean(errors.children)}
                                                    helperText={touched.children && errors.children}
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        endAdornment: (
                                                            <>
                                                                {isLoadingPrivileges ? <CircularProgress color="inherit" size={20} /> : null}
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
                                </Grid>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
            <FloatingAlert 
                open={isCreateError || isCreateSuccess} 
                feedBackMessages={isCreateError ? createError?.response?.data : isCreateSuccess ? 'Rôle créé avec succès' : ''} 
                severity={isCreateError ? 'error' : isCreateSuccess ? 'success' : 'info'}
            />
            <SimpleBackdrop open={isCreating}/>
        </Modal>
    );
};

AddRoleModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired
};

export default AddRoleModal;