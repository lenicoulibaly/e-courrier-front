import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

// material-ui
import {
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
import { useUpdatePrivilege, useTypesByGroupCode } from '../../../hooks/query';
import Modal from '../../../components/commons/Modal';
import FloatingAlert from '../../../components/commons/FloatingAlert';
import SimpleBackdrop from '../../../components/commons/SimpleBackdrop';

// validation schema
const PrivilegeSchema = Yup.object().shape({
    code: Yup.string()
        .required('Le code est obligatoire')
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

// ==============================|| EDIT PRIVILEGE MODAL ||============================== //

const EditPrivilegeModal = ({ open, handleClose, privilege }) => {
    // Mutation for updating a privilege
    const { mutate: updatePrivilege, isPending: isUpdating, isSuccess: isUpdateSuccess, isError: isUpdateError, error: updateError } = useUpdatePrivilege();

    // Fetch privilege types
    const { data: privilegeTypes, isLoading: isLoadingTypes } = useTypesByGroupCode('PRV');

    // Handle form submission
    const handleSubmit = (values, { setSubmitting }) => {
        updatePrivilege(values, {
            onSuccess: () => {
                setSubmitting(false);
            },
            onError: (error) => {
                console.error('Error updating privilege:', error);
                setSubmitting(false);
            }
        });
    };

    // If no privilege is provided, don't render the modal
    if (!privilege) return null;

    return (
        <Modal
            open={open}
            handleClose={handleClose}
            title="Modification de privilège"
            width="sm"
            actionLabel="Enregistrer"
            actionDisabled={isUpdating}
            handleConfirmation={() => {
                document.getElementById('edit-privilege-form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            }}
        >
            <Formik
                initialValues={{
                    code: privilege.code || '',
                    name: privilege.name || '',
                    privilegeCode: privilege.code || '',
                    description: privilege.description || '',
                    typeCode: privilege.typeCode || 'PRV',
                    typeName: privilege.typeName || 'Privilege',
                    privilegeTypeCode: privilege.privilegeTypeCode || ''
                }}
                validationSchema={PrivilegeSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ errors, touched, handleChange, handleBlur, values, isSubmitting }) => (
                    <Form id="edit-privilege-form">
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
            <FloatingAlert open={isUpdateError || isUpdateSuccess} feedBackMessages={isUpdateError ? updateError?.response?.data : isUpdateSuccess ? 'Privilège modifié avec succès' : ''} severity={isUpdateError ? 'error' : isUpdateSuccess ? 'success' : 'info'}/>
            <SimpleBackdrop open={isUpdating}/>
        </Modal>
    );
};

EditPrivilegeModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    privilege: PropTypes.object
};

export default EditPrivilegeModal;
