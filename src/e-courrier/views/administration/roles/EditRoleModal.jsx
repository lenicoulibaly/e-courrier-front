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
import { useUpdateRole } from '../../../hooks/query/useAuthorities';
import { useGetPrivilegesListByTypeCodes, usePrivilegesByRole, useTypesByGroupCode } from '../../../hooks/query';
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

// ==============================|| EDIT ROLE MODAL ||============================== //

const EditRoleModal = ({ open, handleClose, role }) => {
    // State for selected privilege types
    const [selectedPrivilegeTypes, setSelectedPrivilegeTypes] = useState([]);
    // State to track original privileges (for visual differentiation)
    const [originalPrivileges, setOriginalPrivileges] = useState([]);

    // Mutation for updating a role
    const { mutate: updateRole, isPending: isUpdating, isSuccess: isUpdateSuccess, isError: isUpdateError, error: updateError } = useUpdateRole();

    // Fetch privilege types
    const { data: privilegeTypes, isLoading: isLoadingTypes } = useTypesByGroupCode('PRV');

    // Fetch privileges based on selected privilege types
    const { data: privileges, isLoading: isLoadingPrivileges } = useGetPrivilegesListByTypeCodes({
        privilegeTypeCodes: selectedPrivilegeTypes.map(type => type.code)
    });

    // Fetch privileges associated with the role
    const { data: rolePrivileges, isLoading: isLoadingRolePrivileges } = usePrivilegesByRole(role?.code);

    // Set original privileges when role privileges are loaded
    useEffect(() => {
        if (rolePrivileges) {
            setOriginalPrivileges(rolePrivileges);
        }
    }, [rolePrivileges]);

    // Handle form submission
    const handleSubmit = (values, { setSubmitting }) => {
        // Transform children to the expected format
        const formattedValues = {
            ...values,
            children: values.children.map(child => ({ code: child.code }))
        };

        updateRole(formattedValues, {
            onSuccess: () => {
                setSubmitting(false);
            },
            onError: (error) => {
                console.error('Error updating role:', error.response?.data);
                setSubmitting(false);
            }
        });
    };

    // Check if a privilege was in the original set
    const isOriginalPrivilege = (privilege) => {
        return originalPrivileges.some(orig => orig.code === privilege.code);
    };

    // If no role is provided, don't render the modal
    if (!role) return null;

    return (
        <Modal
            open={open}
            handleClose={handleClose}
            title="Modification de rôle"
            width="md"
            actionLabel="Enregistrer"
            actionDisabled={isUpdating}
            handleConfirmation={() => {
                document.getElementById('edit-role-form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            }}
        >
            <Formik
                initialValues={{
                    code: role.code || '',
                    roleCode: role.code,
                    name: role.name || '',
                    typeCode: 'ROL',
                    description: role.description || '',
                    children: rolePrivileges || []
                }}
                validationSchema={RoleSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ errors, touched, handleChange, handleBlur, values, setFieldValue, isSubmitting }) => (
                    <Form id="edit-role-form">
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
                                        {isLoadingRolePrivileges ? (
                                            <CircularProgress />
                                        ) : (
                                            <Autocomplete
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
                                                    value.map((option, index) => {
                                                        const isOriginal = isOriginalPrivilege(option);
                                                        return (
                                                            <Chip
                                                                label={`${option.code} - ${option.name}`}
                                                                size="small"
                                                                {...getTagProps({ index })}
                                                                sx={{
                                                                    backgroundColor: isOriginal ? 'primary.light' : 'default',
                                                                    '& .MuiChip-label': {
                                                                        color: isOriginal ? 'primary.contrastText' : 'text.primary'
                                                                    }
                                                                }}
                                                            />
                                                        );
                                                    })
                                                }
                                            />
                                        )}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
            <FloatingAlert 
                open={isUpdateError || isUpdateSuccess} 
                feedBackMessages={isUpdateError ? updateError?.response?.data : isUpdateSuccess ? 'Rôle modifié avec succès' : ''} 
                severity={isUpdateError ? 'error' : isUpdateSuccess ? 'success' : 'info'}
            />
            <SimpleBackdrop open={isUpdating}/>
        </Modal>
    );
};

EditRoleModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    role: PropTypes.object
};

export default EditRoleModal;