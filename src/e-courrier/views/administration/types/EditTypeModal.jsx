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
} from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import { useUpdateType, useGetAllTypeGroups } from '../../../hooks/query/useTypes';
import Modal from '../../../components/commons/Modal';

// validation schema
const TypeSchema = Yup.object().shape({
    id: Yup.string().required('ID is required'),
    code: Yup.string()
        .required('Code is required')
        .max(50, 'Code must be at most 50 characters'),
    label: Yup.string()
        .required('Label is required')
        .max(100, 'Label must be at most 100 characters'),
    description: Yup.string()
        .max(255, 'Description must be at most 255 characters'),
    groupCode: Yup.string()
        .required('Group is required'),
    privilegeTypeCode: Yup.string()
        .required('Privilege Type is required'),
    active: Yup.boolean()
});

// ==============================|| EDIT TYPE MODAL ||============================== //

const EditTypeModal = ({ open, handleClose, type }) => {
    // Fetch type groups for dropdown
    const { data: typeGroups = [], isLoading: isLoadingGroups } = useGetAllTypeGroups();

    // Mutation for updating a type
    const { mutate: updateType, isLoading: isUpdating } = useUpdateType();

    // Privilege type codes for dropdown
    const privilegeTypeCodes = [
        { value: 'ADMIN', label: 'Admin' },
        { value: 'USER', label: 'User' },
        { value: 'GUEST', label: 'Guest' }
    ];

    // Handle form submission
    const handleSubmit = (values, { setSubmitting }) => {
        updateType(values, {
            onSuccess: () => {
                setSubmitting(false);
                handleClose();
            },
            onError: (error) => {
                console.error('Error updating type:', error);
                setSubmitting(false);
            }
        });
    };

    // If no type is provided, don't render the modal
    if (!type) return null;

    return (
        <Modal
            open={open}
            handleClose={handleClose}
            title="Edit Type"
            width="md"
            actionLabel="Save"
            actionDisabled={isUpdating}
            handleConfirmation={() => {
                // The actual submission is handled by Formik
                document.getElementById('edit-type-form').dispatchEvent(
                    new Event('submit', { cancelable: true, bubbles: true })
                );
            }}
        >
            <Formik
                initialValues={{
                    id: type.id || '',
                    code: type.code || '',
                    label: type.label || '',
                    description: type.description || '',
                    groupCode: type.groupCode || '',
                    privilegeTypeCode: type.privilegeTypeCode || '',
                    active: type.active !== undefined ? type.active : true
                }}
                validationSchema={TypeSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ errors, touched, handleChange, handleBlur, values, isSubmitting }) => (
                    <Form id="edit-type-form">
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
                                    id="label"
                                    name="label"
                                    label="Label"
                                    value={values.label}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.label && Boolean(errors.label)}
                                    helperText={touched.label && errors.label}
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
                            <Grid item xs={12} md={6}>
                                <FormControl 
                                    fullWidth 
                                    error={touched.groupCode && Boolean(errors.groupCode)}
                                >
                                    <InputLabel id="group-code-label">Group</InputLabel>
                                    <Field
                                        size={'small'}
                                        as={Select}
                                        labelId="group-code-label"
                                        id="groupCode"
                                        name="groupCode"
                                        label="Group"
                                        value={values.groupCode}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    >
                                        {isLoadingGroups ? (
                                            <MenuItem value="">
                                                <em>Loading...</em>
                                            </MenuItem>
                                        ) : (
                                            typeGroups?.map((group) => (
                                                <MenuItem key={group.code} value={group.code}>
                                                    {group.label}
                                                </MenuItem>
                                            ))
                                        )}
                                    </Field>
                                    {touched.groupCode && errors.groupCode && (
                                        <FormHelperText>{errors.groupCode}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl 
                                    fullWidth 
                                    error={touched.privilegeTypeCode && Boolean(errors.privilegeTypeCode)}
                                >
                                    <InputLabel id="privilege-type-code-label">Privilege Type</InputLabel>
                                    <Field
                                        size={'small'}
                                        as={Select}
                                        labelId="privilege-type-code-label"
                                        id="privilegeTypeCode"
                                        name="privilegeTypeCode"
                                        label="Privilege Type"
                                        value={values.privilegeTypeCode}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    >
                                        {privilegeTypeCodes.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Field>
                                    {touched.privilegeTypeCode && errors.privilegeTypeCode && (
                                        <FormHelperText>{errors.privilegeTypeCode}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="active-label">Status</InputLabel>
                                    <Field
                                        size={'small'}
                                        as={Select}
                                        labelId="active-label"
                                        id="active"
                                        name="active"
                                        label="Status"
                                        value={values.active}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    >
                                        <MenuItem value={true}>Active</MenuItem>
                                        <MenuItem value={false}>Inactive</MenuItem>
                                    </Field>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

EditTypeModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    type: PropTypes.object
};

export default EditTypeModal;
