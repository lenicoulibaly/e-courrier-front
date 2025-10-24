import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// material-ui
import {
    Grid,
    TextField,
    InputAdornment,
    Button,
    Box,
    Avatar,
    Typography,
    CircularProgress,
    Autocomplete,
    Chip,
    IconButton,
    Paper,
    Divider,
    FormControl,
    styled,
    Tooltip
} from '@mui/material';

// project imports
import Modal from '../../../components/commons/Modal';
import FloatingAlert from '../../../components/commons/FloatingAlert';
import { gridSpacing } from 'store/constant';
import { useVisibleStructures } from '../../../hooks/query/useStructures';

// assets
import { IconCoin } from '@tabler/icons-react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

// Custom styled components for frames with labels
const LabeledFrame = styled(Box)(({ theme }) => ({
    position: 'relative',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(3, 2, 2),
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1)
}));

const FrameLabel = styled(Typography)(({ theme }) => ({
    position: 'absolute',
    top: '-12px',
    left: theme.spacing(2),
    padding: theme.spacing(0, 1),
    backgroundColor: theme.palette.background.paper,
    fontWeight: 500,
    fontSize: '0.875rem',
    color: theme.palette.text.primary
}));

// ==============================|| ASSOCIATION MODAL ||============================== //

const AssociationModal = ({ open, handleClose, association, isEdit }) => {
    // Form state
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        acronym: '',
        location: '',
        membershipFee: '',
        logo: null,
        structures: [],
        sections: []
    });

    // Default empty section
    const emptySection = {
        id: 0,
        name: '',
        acronym: '',
        structure: null,
        location: ''
    };

    // File state
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);

    // Validation state
    const [errors, setErrors] = useState({});

    // Alert state
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');

    // Loading state
    const [loading, setLoading] = useState(false);

    // Fetch structures for the MultiSelect
    const { data: structures, isLoading: loadingStructures } = useVisibleStructures();

    // Initialize form data when association changes
    useEffect(() => {
        if (association && isEdit) {
            setFormData({
                id: association.id || '',
                name: association.name || '',
                acronym: association.acronym || '',
                location: association.location || '',
                membershipFee: association.membershipFee || '',
                logo: association.logo || null,
                structures: association.structures || [],
                sections: association.sections || []
            });
            setLogoPreview(association.logo);
            setErrors({});
        } else {
            // Reset form for new association
            setFormData({
                id: '',
                name: '',
                acronym: '',
                location: '',
                membershipFee: '',
                logo: null,
                structures: [],
                sections: []
            });
            setLogoFile(null);
            setLogoPreview(null);
            setErrors({});
        }
    }, [association, isEdit, open]);

    // Handle adding a new section
    const handleAddSection = () => {
        setFormData({
            ...formData,
            sections: [...formData.sections, { ...emptySection, id: Date.now() }]
        });
    };

    // Handle removing a section
    const handleRemoveSection = (sectionId) => {
        setFormData({
            ...formData,
            sections: formData.sections.filter(section => section.id !== sectionId)
        });
    };

    // Handle section field change
    const handleSectionFieldChange = (sectionId, field, value) => {
        setFormData({
            ...formData,
            sections: formData.sections.map(section => 
                section.id === sectionId ? { ...section, [field]: value } : section
            )
        });
    };

    // Handle adding a new section at a specific index
    const handleAddSectionAtIndex = (index) => {
        const newSections = [...formData.sections];
        newSections.splice(index + 1, 0, { ...emptySection, id: Date.now() });
        setFormData({
            ...formData,
            sections: newSections
        });
    };

    // Handle structures selection change
    const handleStructuresChange = (event, newValue) => {
        setFormData({
            ...formData,
            structures: newValue
        });
    };

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Handle numeric input for membership fee
        if (name === 'membershipFee') {
            // Allow only numbers
            if (value === '' || /^[0-9]+$/.test(value)) {
                setFormData({
                    ...formData,
                    [name]: value
                });
            }
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }

        // Clear error for this field
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    // Handle file change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);

            // Create a preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Update form data
            setFormData({
                ...formData,
                logo: file
            });

            // Clear any error for logo
            if (errors.logo) {
                setErrors({
                    ...errors,
                    logo: null
                });
            }
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Le nom est requis';
        }

        if (!formData.acronym.trim()) {
            newErrors.acronym = 'Le sigle est requis';
        }

        if (!formData.location.trim()) {
            newErrors.location = 'La situation géographique est requise';
        }

        if (!formData.membershipFee) {
            newErrors.membershipFee = 'Le droit d\'adhésion est requis';
        }

        // Validate sections
        if (formData.sections.length === 0) {
            newErrors.sections = 'Au moins une section est requise';
        } else {
            const invalidSections = formData.sections.filter(
                section => 
                    !section.name.trim() || 
                    !section.acronym.trim() || 
                    !section.location.trim() || 
                    !section.structure
            );
            if (invalidSections.length > 0) {
                newErrors.sections = 'Tous les champs des sections doivent être remplis';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (validateForm()) {
            setLoading(true);
            try {
                // In a real application, you would call an API here
                // For now, we'll just simulate a successful operation
                await new Promise(resolve => setTimeout(resolve, 1000));

                setAlertMessage(`Association ${isEdit ? 'modifiée' : 'créée'} avec succès`);
                setAlertSeverity('success');
                setAlertOpen(true);

                // Close modal after successful operation
                setTimeout(() => {
                    handleClose();
                    setLoading(false);
                }, 1000);
            } catch (error) {
                setAlertMessage(`Une erreur est survenue lors de ${isEdit ? 'la modification' : 'la création'} de l'association`);
                setAlertSeverity('error');
                setAlertOpen(true);
                setLoading(false);
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
                title={isEdit ? "Modifier une association" : "Ajouter une association"}
                handleClose={handleClose}
                handleConfirmation={handleSubmit}
                actionDisabled={loading}
                actionLabel="Enregistrer"
                width="lg"
            >
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <LabeledFrame>
                            <FrameLabel>Informations relatives à l'association</FrameLabel>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Nom de l'association"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        error={Boolean(errors.name)}
                                        helperText={errors.name}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Sigle"
                                        name="acronym"
                                        value={formData.acronym}
                                        onChange={handleInputChange}
                                        error={Boolean(errors.acronym)}
                                        helperText={errors.acronym}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Droit d'adhésion"
                                        name="membershipFee"
                                        value={formData.membershipFee}
                                        onChange={handleInputChange}
                                        error={Boolean(errors.membershipFee)}
                                        helperText={errors.membershipFee}
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <IconCoin size="1rem" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: <InputAdornment position="end">FCFA</InputAdornment>
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Autocomplete
                                        multiple
                                        options={structures || []}
                                        getOptionLabel={(option) => option.strName || ''}
                                        value={formData.structures}
                                        onChange={handleStructuresChange}
                                        loading={loadingStructures}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Structures"
                                                placeholder="Sélectionnez les structures"
                                                variant="outlined"
                                                size="small"
                                            />
                                        )}
                                        renderTags={(value, getTagProps) =>
                                            value.map((option, index) => (
                                                <Chip
                                                    key={option.strId}
                                                    label={option.strName}
                                                    {...getTagProps({ index })}
                                                    size="small"
                                                />
                                            ))
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Situation géographique"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        error={Boolean(errors.location)}
                                        helperText={errors.location}
                                        required
                                        placeholder="Ex: Abidjan/Plateau/Cité Financière"
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Logo"
                                        InputProps={{
                                            startAdornment: logoPreview && (
                                                <InputAdornment position="start">
                                                    <Avatar 
                                                        src={logoPreview} 
                                                        alt="Logo preview" 
                                                        sx={{ width: 24, height: 24, mr: 1 }}
                                                    />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Button
                                                        component="label"
                                                        variant="contained"
                                                        size="small"
                                                        sx={{ minWidth: 'auto', p: '4px 8px' }}
                                                    >
                                                        {logoPreview ? 'Changer' : 'Choisir'}
                                                        <input
                                                            type="file"
                                                            hidden
                                                            accept="image/*"
                                                            onChange={handleFileChange}
                                                        />
                                                    </Button>
                                                </InputAdornment>
                                            )
                                        }}
                                        placeholder="Sélectionner un logo"
                                        value={logoFile ? logoFile.name : ''}
                                        disabled
                                    />
                                </Grid>
                            </Grid>
                        </LabeledFrame>
                    </Grid>

                    <Grid item xs={12}>
                        <LabeledFrame>
                            <FrameLabel>Sections</FrameLabel>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                                <Tooltip title="Ajouter une section">
                                    <IconButton
                                        color="primary"
                                        onClick={handleAddSection}
                                        size="small"
                                        sx={{ 
                                            bgcolor: (theme) => theme.palette.primary.main, 
                                            color: 'white', 
                                            borderRadius: '4px', 
                                            width: 36, 
                                            height: 36,
                                            '&:hover': { 
                                                bgcolor: (theme) => theme.palette.primary.dark 
                                            } 
                                        }}
                                    >
                                        <AddIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>

                            {errors.sections && (
                                <Typography color="error" variant="caption">
                                    {errors.sections}
                                </Typography>
                            )}

                            {formData.sections.length === 0 ? (
                                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                                    <Typography variant="body2" color="textSecondary">
                                        Aucune section ajoutée. Cliquez sur "Ajouter une section" pour commencer.
                                    </Typography>
                                </Paper>
                            ) : (
                                <Paper variant="outlined" sx={{ p: 2 }}>
                                    {formData.sections.map((section, index) => (
                                        <Box key={section.id} sx={{ mb: index < formData.sections.length - 1 ? 2 : 0 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1.5, mt: 0.5 }}>
                                                    <IconButton 
                                                        color="primary" 
                                                        onClick={() => handleAddSectionAtIndex(index)}
                                                        size="small"
                                                        sx={{ 
                                                            bgcolor: (theme) => theme.palette.primary.main, 
                                                            color: 'white', 
                                                            borderRadius: '50%',
                                                            width: 30,
                                                            height: 30,
                                                            '&:hover': { 
                                                                bgcolor: (theme) => theme.palette.primary.dark 
                                                            } 
                                                        }}
                                                    >
                                                        <AddIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton 
                                                        color="error" 
                                                        onClick={() => handleRemoveSection(section.id)}
                                                        size="small"
                                                        sx={{ 
                                                            bgcolor: (theme) => theme.palette.error.main, 
                                                            color: 'white', 
                                                            borderRadius: '50%',
                                                            width: 30,
                                                            height: 30,
                                                            '&:hover': { 
                                                                bgcolor: (theme) => theme.palette.error.dark 
                                                            } 
                                                        }}
                                                    >
                                                        <RemoveIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                                <Grid container spacing={2}>
                                                    <Grid item sm={12} md={4}>
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            label="Nom"
                                                            value={section.name}
                                                            onChange={(e) => handleSectionFieldChange(section.id, 'name', e.target.value)}
                                                            error={!section.name.trim()}
                                                            helperText={!section.name.trim() ? 'Le nom est requis' : ''}
                                                        />
                                                    </Grid>
                                                    <Grid item sm={12} md={4}>
                                                        <Autocomplete
                                                            options={structures || []}
                                                            getOptionLabel={(option) => option.strName || ''}
                                                            value={section.structure}
                                                            onChange={(event, newValue) => handleSectionFieldChange(section.id, 'structure', newValue)}
                                                            loading={loadingStructures}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label="Structure"
                                                                    placeholder="Sélectionnez une structure"
                                                                    variant="outlined"
                                                                    size="small"
                                                                    error={!section.structure}
                                                                    helperText={!section.structure ? 'La structure est requise' : ''}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid item sm={12} md={4}>
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            label="Situation géographique"
                                                            value={section.location}
                                                            onChange={(e) => handleSectionFieldChange(section.id, 'location', e.target.value)}
                                                            error={!section.location.trim()}
                                                            helperText={!section.location.trim() ? 'La situation géographique est requise' : ''}
                                                            placeholder="Ex: Abidjan/Plateau/Cité Financière"
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                            {index < formData.sections.length - 1 && <Divider sx={{ my: 2 }} />}
                                        </Box>
                                    ))}
                                </Paper>
                            )}
                        </LabeledFrame>
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

AssociationModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    association: PropTypes.object,
    isEdit: PropTypes.bool
};

AssociationModal.defaultProps = {
    association: null,
    isEdit: false
};

export default AssociationModal;
