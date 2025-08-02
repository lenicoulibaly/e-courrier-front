import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// material-ui
import {
    Grid,
    TextField,
    CircularProgress
} from '@mui/material';

// project imports
import Modal from '../../../components/commons/Modal';
import FloatingAlert from '../../../components/commons/FloatingAlert';
import { useUpdateStructure } from '../../../hooks/query/useStructures';
import { gridSpacing } from 'store/constant';

// ==============================|| EDIT STRUCTURE MODAL ||============================== //

const EditStructureModal = ({ open, handleClose, structure }) => {
    // Form state
    const [formData, setFormData] = useState({
        strId: '',
        strName: '',
        strSigle: '',
        strTel: '',
        strAddress: '',
        situationGeo: ''
    });

    // Validation state
    const [errors, setErrors] = useState({});

    // Alert state
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');

    // Update structure mutation
    const updateStructureMutation = useUpdateStructure();

    // Initialize form data when structure changes
    useEffect(() => {
        if (structure) {
            setFormData({
                strId: structure.strId,
                strName: structure.strName || '',
                strSigle: structure.strSigle || '',
                strTel: structure.strTel || '',
                strAddress: structure.strAddress || '',
                situationGeo: structure.situationGeo || ''
            });
            setErrors({});
        }
    }, [structure]);

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
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

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.strName.trim()) {
            newErrors.strName = 'Le nom est requis';
        }

        if (!formData.strSigle.trim()) {
            newErrors.strSigle = 'Le sigle est requis';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                await updateStructureMutation.mutateAsync(formData);
                setAlertMessage('Structure modifiée avec succès');
                setAlertSeverity('success');
                setAlertOpen(true);

                // Close modal after successful update
                setTimeout(() => {
                    handleClose();
                }, 1000);
            } catch (error) {
                setAlertMessage(
                    Array.isArray(error.response?.data) 
                        ? error.response.data 
                        : ['Une erreur est survenue lors de la modification de la structure']
                );
                setAlertSeverity('error');
                setAlertOpen(true);
            }
        }
    };

    // Handle alert close
    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    return (
        <>
            <Modal
                open={open}
                title="Modifier la structure"
                handleClose={handleClose}
                handleConfirmation={handleSubmit}
                actionDisabled={updateStructureMutation.isLoading}
                actionLabel="Enregistrer"
                width="md"
            >
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Nom de la structure"
                            name="strName"
                            value={formData.strName}
                            onChange={handleInputChange}
                            error={Boolean(errors.strName)}
                            helperText={errors.strName}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Sigle"
                            name="strSigle"
                            value={formData.strSigle}
                            onChange={handleInputChange}
                            error={Boolean(errors.strSigle)}
                            helperText={errors.strSigle}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Téléphone"
                            name="strTel"
                            value={formData.strTel}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Adresse"
                            name="strAddress"
                            value={formData.strAddress}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Situation géographique (latitude, longitude)"
                            name="situationGeo"
                            value={formData.situationGeo}
                            onChange={handleInputChange}
                            placeholder="Ex: 5.348, -4.007"
                        />
                    </Grid>
                </Grid>
            </Modal>

            {/* Alert for feedback */}
            <FloatingAlert
                open={alertOpen}
                feedBackMessages={alertMessage}
                severity={alertSeverity}
                timeout={alertSeverity === 'error' ? 7 : 3}
                onClose={handleAlertClose}
            />
        </>
    );
};

EditStructureModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    structure: PropTypes.object.isRequired
};

export default EditStructureModal;
