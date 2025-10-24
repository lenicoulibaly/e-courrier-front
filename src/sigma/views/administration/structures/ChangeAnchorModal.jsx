import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// material-ui
import {
    Grid,
    TextField,
    Autocomplete,
    CircularProgress
} from '@mui/material';

// project imports
import Modal from '../../../components/commons/Modal';
import FloatingAlert from '../../../components/commons/FloatingAlert';
import { useTypesByGroupCode } from '../../../hooks/query/useTypes';
import { usePossibleParents, useChangeAnchor } from '../../../hooks/query/useStructures';
import { gridSpacing } from 'store/constant';

// ==============================|| CHANGE ANCHOR MODAL ||============================== //

const ChangeAnchorModal = ({ open, handleClose, structure }) => {
    // Form state
    const [formData, setFormData] = useState({
        strId: '',
        strName: '',
        strSigle: '',
        typeCode: '',
        parentId: null,
        strTel: '',
        strAddress: '',
        situationGeo: ''
    });

    // Selected items for autocompletes
    const [selectedType, setSelectedType] = useState(null);
    const [selectedParent, setSelectedParent] = useState(null);

    // Validation state
    const [errors, setErrors] = useState({});

    // Alert state
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');

    // Fetch structure types
    const { data: structureTypes, isLoading: isLoadingTypes } = useTypesByGroupCode("STR");

    // Fetch possible parents based on selected type
    const { data: possibleParents, isLoading: isLoadingParents } = usePossibleParents({
        childTypeCode: formData.typeCode
    });

    // Change anchor mutation
    const changeAnchorMutation = useChangeAnchor();

    // Initialize form data when structure changes
    useEffect(() => {
        if (structure) {
            setFormData({
                strId: structure.strId,
                strName: structure.strName || '',
                strSigle: structure.strSigle || '',
                typeCode: structure.strTypeCode || '',
                parentId: structure.parentId || null,
                strTel: structure.strTel || '',
                strAddress: structure.strAddress || '',
                situationGeo: structure.situationGeo || ''
            });

            // Find the type in the types list
            if (structureTypes) {
                const type = structureTypes.find(t => t.typeCode === structure.strTypeCode);
                setSelectedType(type || null);
            }

            setErrors({});
        }
    }, [structure, structureTypes]);

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

    // Handle type selection
    const handleTypeChange = (event, newValue) => {
        setSelectedType(newValue);
        setSelectedParent(null); // Reset parent when type changes

        setFormData({
            ...formData,
            typeCode: newValue?.typeCode || '',
            parentId: null
        });

        // Clear error for this field
        if (errors.typeCode) {
            setErrors({
                ...errors,
                typeCode: null
            });
        }
    };

    // Handle parent selection
    const handleParentChange = (event, newValue) => {
        setSelectedParent(newValue);

        setFormData({
            ...formData,
            parentId: newValue?.strId || null
        });

        // Clear error for this field
        if (errors.parentId) {
            setErrors({
                ...errors,
                parentId: null
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

        if (!formData.typeCode) {
            newErrors.typeCode = 'Le type est requis';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                await changeAnchorMutation.mutateAsync(formData);
                setAlertMessage('Ancrage institutionnel modifié avec succès');
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
                        : ['Une erreur est survenue lors de la modification de l\'ancrage institutionnel']
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

    // Find the parent in the possible parents list when they are loaded
    useEffect(() => {
        if (possibleParents && formData.parentId) {
            const parent = possibleParents.find(p => p.strId === formData.parentId);
            setSelectedParent(parent || null);
        }
    }, [possibleParents, formData.parentId]);

    return (
        <>
            <Modal
                open={open}
                title="Changer l'ancrage institutionnel"
                handleClose={handleClose}
                handleConfirmation={handleSubmit}
                actionDisabled={changeAnchorMutation.isLoading}
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
                        <Autocomplete
                            id="structure-type"
                            options={structureTypes || []}
                            getOptionLabel={(option) => option.name}
                            value={selectedType}
                            onChange={handleTypeChange}
                            size="small"
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Type de structure"
                                    variant="outlined"
                                    error={Boolean(errors.typeCode)}
                                    helperText={errors.typeCode}
                                    required
                                    size="small"
                                />
                            )}
                            loading={isLoadingTypes}
                            loadingText="Chargement..."
                            noOptionsText="Aucun type trouvé"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Autocomplete
                            id="parent-structure"
                            options={possibleParents || []}
                            getOptionLabel={(option) => option.strName}
                            value={selectedParent}
                            onChange={handleParentChange}
                            size="small"
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Structure parente"
                                    variant="outlined"
                                    error={Boolean(errors.parentId)}
                                    helperText={errors.parentId}
                                    size="small"
                                />
                            )}
                            loading={isLoadingParents}
                            loadingText="Chargement..."
                            noOptionsText="Aucune structure parente disponible"
                            disabled={!formData.typeCode}
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

ChangeAnchorModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    structure: PropTypes.object.isRequired
};

export default ChangeAnchorModal;
