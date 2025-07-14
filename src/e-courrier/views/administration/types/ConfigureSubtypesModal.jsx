import React, { useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import {
    Grid,
    Typography,
    CircularProgress,
    Autocomplete,
    TextField,
    Paper,
    Divider,
    useTheme,
    Chip
} from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import Modal from '../../../components/commons/Modal';
import FloatingAlert from '../../../components/commons/FloatingAlert';
import SimpleBackdrop from '../../../components/commons/SimpleBackdrop';
import { typeApi } from '../../../api/administrationApi';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { Formik, Form } from 'formik';

// ==============================|| CONFIGURE SUBTYPES MODAL ||============================== //

const ConfigureSubtypesModal = ({ open, handleClose, type }) => {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const queryClient = useQueryClient();
    const theme = useTheme();

    // Fetch direct subtypes (currently associated with the type)
    const { 
        data: directSubtypesData, 
        isLoading: isLoadingDirectSubtypes 
    } = useQuery({
        queryKey: ['directSubtypes', type?.code],
        queryFn: () => typeApi.getDirectSousTypes({ parentCode: type.code }),
        enabled: !!type && open,
        staleTime: 60000
    });

    // Fetch possible subtypes (all types that can be associated as subtypes)
    const { 
        data: possibleSubtypesData, 
        isLoading: isLoadingPossibleSubtypes 
    } = useQuery({
        queryKey: ['possibleSubtypes', type?.code],
        queryFn: () => typeApi.getPossibleSousTypes({ parentCode: type.code }),
        enabled: !!type && open,
        staleTime: 60000
    });

    // Format the data for the Autocomplete component
    const formattedDirectSubtypes = directSubtypesData?.map(subtype => ({
        id: subtype.code,
        label: subtype.name
    })) || [];

    const formattedPossibleSubtypes = possibleSubtypesData?.map(subtype => ({
        id: subtype.code,
        label: subtype.name
    })) || [];

    // Mutation for saving subtypes
    const { mutate: saveSubtypes, isPending: saving } = useMutation({
        mutationFn: (values) => {
            return typeApi.setSousTypes({
                code: type.code,
                name: type.name,
                ordre: type.ordre || 0,
                groupCode: type.groupCode,
                description: type.description,
                sousTypeCodes: values.selectedSubtypes.map(subtype => subtype.id)
            });
        },
        onSuccess: () => {
            setSuccess(true);
            queryClient.invalidateQueries(['types']);
            queryClient.invalidateQueries(['directSubtypes']);
            queryClient.invalidateQueries(['possibleSubtypes']);

            // Close the modal after a short delay
            setTimeout(() => {
                handleClose();
            }, 1500);
        },
        onError: (err) => {
            console.error('Error saving subtypes:', err);
            setError(err.response?.data || 'Erreur lors de l\'enregistrement des sous-types');
        }
    });

    // If no type is provided, don't render the modal
    if (!type) return null;

    const isLoading = isLoadingDirectSubtypes || isLoadingPossibleSubtypes;

    return (
        <Modal
            open={open}
            handleClose={handleClose}
            title={`Configuration des sous-types pour ${type.name}`}
            width="sm"
            actionLabel="Enregistrer"
            actionDisabled={saving}
            handleConfirmation={() => {
                // The form submission will be handled by Formik
                document.getElementById('subtypes-form').dispatchEvent(
                    new Event('submit', { cancelable: true, bubbles: true })
                );
            }}
        >
            {isLoading ? (
                <Grid container justifyContent="center" alignItems="center" sx={{ py: 3 }}>
                    <CircularProgress />
                </Grid>
            ) : (
                <Formik
                    initialValues={{
                        selectedSubtypes: formattedDirectSubtypes
                    }}
                    onSubmit={(values) => {
                        saveSubtypes(values);
                    }}
                >
                    {({ values, setFieldValue }) => (
                        <Form id="subtypes-form">
                            <Grid container spacing={gridSpacing}>
                                <Grid item xs={12}>
                                    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                                        <Typography variant="h4" gutterBottom>
                                            Informations du type
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="subtitle1">
                                                    <strong>Nom:</strong> {type.name}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="subtitle1">
                                                    <strong>Code:</strong> {type.code}
                                                </Typography>
                                            </Grid>
                                            {type.description && (
                                                <Grid item xs={12}>
                                                    <Typography variant="subtitle1">
                                                        <strong>Description:</strong> {type.description}
                                                    </Typography>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </Paper>
                                    <Typography variant="body1" gutterBottom>
                                        Sélectionnez les sous-types à associer au type <strong>{type.name}</strong>.
                                    </Typography>

                                </Grid>
                                <Grid item xs={12}>
                                    <Autocomplete
                                        multiple
                                        disableCloseOnSelect
                                        options={formattedPossibleSubtypes}
                                        getOptionLabel={(option) => option.label}
                                        value={values.selectedSubtypes}
                                        onChange={(event, newValue) => {
                                            setFieldValue('selectedSubtypes', newValue);
                                        }}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderTags={(tagValue, getTagProps) => 
                                            tagValue.map((option, index) => {
                                                // Check if this option was in the initial formattedDirectSubtypes
                                                const isPreselected = formattedDirectSubtypes.some(
                                                    subtype => subtype.id === option.id
                                                );

                                                // Apply distinctive styling to preselected subtypes
                                                const tagProps = getTagProps({ index });
                                                const chipStyle = isPreselected ? {
                                                    color: theme.palette.success.main,
                                                    fontWeight: 'bolder',
                                                    backgroundColor: theme.palette.success.light,
                                                    borderColor: theme.palette.success.main,
                                                    borderWidth: '1px',
                                                    borderStyle: 'solid'
                                                } : {};

                                                return (
                                                    <Chip
                                                        {...tagProps}
                                                        key={option.id}
                                                        label={option.label}
                                                        sx={chipStyle}
                                                        onDelete={tagProps.onDelete}
                                                    />
                                                );
                                            })
                                        }
                                        renderOption={(props, option, { selected }) => {
                                            // Check if this option was in the initial formattedDirectSubtypes
                                            const isPreselected = formattedDirectSubtypes.some(
                                                subtype => subtype.id === option.id
                                            );

                                            // Apply success color to preselected subtypes in the dropdown
                                            return (
                                                <li 
                                                    {...props} 
                                                    style={{
                                                        ...props.style,
                                                        color: isPreselected ? theme.palette.success.main : undefined,
                                                        fontWeight: isPreselected ? 'bold' : undefined
                                                    }}
                                                >
                                                    {option.label}
                                                </li>
                                            );
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                label="Sous-types"
                                                placeholder="Sélectionnez les sous-types"
                                                fullWidth
                                            />
                                        )}
                                        sx={{ 
                                            width: '100%',
                                            minHeight: '200px',
                                            '& .MuiOutlinedInput-root': {
                                                minHeight: '150px',
                                                alignItems: 'flex-start'
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            )}
            <FloatingAlert 
                open={error !== null || success} 
                feedBackMessages={error || (success ? 'Sous-types configurés avec succès' : '')} 
                severity={error ? 'error' : 'success'}
            />
            <SimpleBackdrop open={saving} />
        </Modal>
    );
};

ConfigureSubtypesModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    type: PropTypes.object
};

export default ConfigureSubtypesModal;
