import React from 'react';
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
} from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import { useCreatePrivilege, useTypesByGroupCode } from '../../../hooks/query';
import Modal from '../../../components/commons/Modal';
import FloatingAlert from '../../../components/commons/FloatingAlert';
import SimpleBackdrop from '../../../components/commons/SimpleBackdrop';

// validation schema
const PrivilegeSchema = Yup.object().shape({
    code: Yup.string()
        .required('Le code est requis')
        .max(50, 'La taille du code ne peut excéder 50 caractères'),
    name: Yup.string()
        .required('Le nom est obligatoire')
        .max(100, 'La taille du nom ne peut excéder 100 caractères'),
    description: Yup.string()
        .max(255, 'La description ne peut excéder 255 caractères'),
    typeCode: Yup.string()
        .required('Le code du type est obligatoire'),
    typeName: Yup.string()
        .required('Le nom du type est obligatoire'),
    privilegeTypeCode: Yup.string()
        .required('Le code du type de privilège est obligatoire')
});

// ==============================|| ADD PRIVILEGE MODAL ||============================== //

const AddPrivilegeModal = ({ open, handleClose }) => {
    // Mutation for creating a new privilege
    const { mutate: createPrivilege, isPending: isCreating, isSuccess: isCreateSuccess, isError: isCreateError, error: createError } = useCreatePrivilege();

    // Fetch privilege types
    const { data: privilegeTypes, isLoading: isLoadingTypes } = useTypesByGroupCode('PRV');

    // Initial form values
    const initialValues = {
        code: '',
        name: '',
        description: '',
        typeCode: 'PRV',
        typeName: 'Privilege',
        privilegeTypeCode: ''
    };

    // Handle form submission
    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        createPrivilege(values, {
            onSuccess: () => {
                setSubmitting(false);
                resetForm();
            },
            onError: (error) => {
                console.error('Error creating privilege:', error.response?.data);
                setSubmitting(false);
            }
        });
    };

    return (
        <Modal
            open={open}
            handleClose={handleClose}
            title="Création d'un nouveau privilège"
            width="sm"
            actionLabel="Enregistrer"
            actionDisabled={isCreating}
            handleConfirmation={() => {
                document.getElementById('add-privilege-form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            }}
        >
            <Formik initialValues={initialValues} validationSchema={PrivilegeSchema} onSubmit={handleSubmit}>
                {({ errors, touched, handleChange, handleBlur, values, isSubmitting }) => (
                    <Form id="add-privilege-form">
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
                                <Autocomplete
                                    id="privilegeTypeCode-autocomplete"
                                    options={privilegeTypes || []}
                                    getOptionLabel={(option) => `${option.code} - ${option.name}`}
                                    value={privilegeTypes?.find(type => type.code === values.privilegeTypeCode) || null}
                                    onChange={(event, newValue) => {
                                        handleChange({
                                            target: {
                                                name: 'privilegeTypeCode',
                                                value: newValue ? newValue.code : ''
                                            }
                                        });
                                    }}
                                    loading={isLoadingTypes}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            size="small"
                                            label="Code du type de privilège"
                                            error={touched.privilegeTypeCode && Boolean(errors.privilegeTypeCode)}
                                            helperText={touched.privilegeTypeCode && errors.privilegeTypeCode}
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
                        </Grid>
                    </Form>
                )}
            </Formik>
            <FloatingAlert 
                open={isCreateError || isCreateSuccess} 
                feedBackMessages={isCreateError ? createError?.response?.data : isCreateSuccess ? 'Privilège créé avec succès' : ''} 
                severity={isCreateError ? 'error' : isCreateSuccess ? 'success' : 'info'}
            />
            <SimpleBackdrop open={isCreating}/>
        </Modal>
    );
};

AddPrivilegeModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired
};

export default AddPrivilegeModal;
