import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// material-ui
import {
    Grid,
    TextField,
    InputAdornment,
    Button,
    Box,
    Typography,
    CircularProgress,
    Autocomplete,
    FormControl,
    styled
} from '@mui/material';

// project imports
import Modal from '../../../components/commons/Modal';
import FloatingAlert from '../../../components/commons/FloatingAlert';
import { gridSpacing } from 'store/constant';

// assets
import { IconCoin } from '@tabler/icons-react';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaymentIcon from '@mui/icons-material/Payment';
import BusinessIcon from '@mui/icons-material/Business';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import DescriptionIcon from '@mui/icons-material/Description';

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

// ==============================|| COTISATION MODAL ||============================== //

const CotisationModal = ({ open, handleClose, association }) => {
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        frequency: null,
        paymentMethod: null,
        startDate: '',
        endDate: '',
        gracePeriod: '',
        association: association || null,
        section: null,
        reason: ''
    });

    // Validation state
    const [errors, setErrors] = useState({});

    // Alert state
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');

    // Loading state
    const [loading, setLoading] = useState(false);

    // Options for dropdowns
    const frequencyOptions = [
        { id: 1, label: 'Mensuelle' },
        { id: 2, label: 'Trimestrielle' },
        { id: 3, label: 'Semestrielle' },
        { id: 4, label: 'Annuelle' }
    ];

    const paymentMethodOptions = [
        { id: 1, label: 'Automatique à la source' },
        { id: 2, label: 'Espèce' },
        { id: 3, label: 'Mobile money' },
        { id: 4, label: 'Chèque' },
        { id: 5, label: 'Virement bancaire' }
    ];

    // Mock sections for the selected association
    const sectionOptions = association ? [
        { id: 1, label: `${association.acronym}/DGMP` },
        { id: 2, label: `${association.acronym}/DGI` },
        { id: 3, label: `${association.acronym}/DGBF` }
    ] : [];

    // Initialize form data when association changes
    useEffect(() => {
        if (association) {
            setFormData(prevData => ({
                ...prevData,
                association: association
            }));
            setErrors({});
        }
    }, [association, open]);

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Handle numeric input for amount and gracePeriod
        if (name === 'amount' || name === 'gracePeriod') {
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

    // Handle autocomplete change
    const handleAutocompleteChange = (name, value) => {
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

        if (!formData.name.trim()) {
            newErrors.name = 'Le nom est requis';
        }

        if (!formData.amount) {
            newErrors.amount = 'Le montant est requis';
        }

        if (!formData.frequency) {
            newErrors.frequency = 'La fréquence est requise';
        }

        if (!formData.paymentMethod) {
            newErrors.paymentMethod = 'Le mode de prélèvement est requis';
        }

        if (!formData.startDate) {
            newErrors.startDate = 'La date de début est requise';
        }

        if (!formData.endDate) {
            newErrors.endDate = 'La date de fin est requise';
        }

        if (!formData.gracePeriod) {
            newErrors.gracePeriod = 'Le délai de rigueur est requis';
        }

        if (!formData.association) {
            newErrors.association = 'L\'association est requise';
        }

        if (!formData.section) {
            newErrors.section = 'La section est requise';
        }

        if (!formData.reason.trim()) {
            newErrors.reason = 'Le motif est requis';
        }

        // Validate date range
        if (formData.startDate && formData.endDate) {
            const startDate = new Date(formData.startDate);
            const endDate = new Date(formData.endDate);
            if (startDate > endDate) {
                newErrors.endDate = 'La date de fin doit être postérieure à la date de début';
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

                setAlertMessage('Cotisation créée avec succès');
                setAlertSeverity('success');
                setAlertOpen(true);

                // Close modal after successful operation
                setTimeout(() => {
                    handleClose();
                    setLoading(false);
                }, 1000);
            } catch (error) {
                setAlertMessage('Une erreur est survenue lors de la création de la cotisation');
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
                title="Ajout d'une nouvelle cotisation"
                handleClose={handleClose}
                handleConfirmation={handleSubmit}
                actionDisabled={loading}
                actionLabel="Enregistrer"
                width="md"
            >
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <LabeledFrame>
                            <FrameLabel>Informations de la cotisation</FrameLabel>
                            <Grid container spacing={2}>
                                {/* First row - 3 fields */}
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Nom"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        error={Boolean(errors.name)}
                                        helperText={errors.name}
                                        required
                                        placeholder="Cotisation xxx"
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Montant"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleInputChange}
                                        error={Boolean(errors.amount)}
                                        helperText={errors.amount}
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
                                        options={frequencyOptions}
                                        getOptionLabel={(option) => option.label}
                                        value={formData.frequency}
                                        onChange={(event, newValue) => handleAutocompleteChange('frequency', newValue)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Fréquence des prélèvements"
                                                placeholder="Sélectionnez une fréquence"
                                                variant="outlined"
                                                size="small"
                                                error={Boolean(errors.frequency)}
                                                helperText={errors.frequency}
                                                required
                                                InputProps={{
                                                    ...params.InputProps,
                                                    startAdornment: (
                                                        <>
                                                            <InputAdornment position="start">
                                                                <AccessTimeIcon fontSize="small" />
                                                            </InputAdornment>
                                                            {params.InputProps.startAdornment}
                                                        </>
                                                    )
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* Second row - 3 fields */}
                                <Grid item xs={12} md={4}>
                                    <Autocomplete
                                        options={paymentMethodOptions}
                                        getOptionLabel={(option) => option.label}
                                        value={formData.paymentMethod}
                                        onChange={(event, newValue) => handleAutocompleteChange('paymentMethod', newValue)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Mode de prélèvement (F CFA)"
                                                placeholder="Sélectionnez un mode"
                                                variant="outlined"
                                                size="small"
                                                error={Boolean(errors.paymentMethod)}
                                                helperText={errors.paymentMethod}
                                                required
                                                InputProps={{
                                                    ...params.InputProps,
                                                    startAdornment: (
                                                        <>
                                                            <InputAdornment position="start">
                                                                <PaymentIcon fontSize="small" />
                                                            </InputAdornment>
                                                            {params.InputProps.startAdornment}
                                                        </>
                                                    )
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Date de début"
                                        name="startDate"
                                        type="date"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        error={Boolean(errors.startDate)}
                                        helperText={errors.startDate}
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CalendarMonthIcon fontSize="small" />
                                                </InputAdornment>
                                            )
                                        }}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Date de fin"
                                        name="endDate"
                                        type="date"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        error={Boolean(errors.endDate)}
                                        helperText={errors.endDate}
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CalendarMonthIcon fontSize="small" />
                                                </InputAdornment>
                                            )
                                        }}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                    />
                                </Grid>

                                {/* Third row - 3 fields */}
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Délais de rigueur (en jours)"
                                        name="gracePeriod"
                                        value={formData.gracePeriod}
                                        onChange={handleInputChange}
                                        error={Boolean(errors.gracePeriod)}
                                        helperText={errors.gracePeriod}
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AccessTimeIcon fontSize="small" />
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Association"
                                        value={formData.association ? `${formData.association.name} (${formData.association.acronym})` : ''}
                                        InputProps={{
                                            readOnly: true,
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <BusinessIcon fontSize="small" />
                                                </InputAdornment>
                                            )
                                        }}
                                        error={Boolean(errors.association)}
                                        helperText={errors.association}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Autocomplete
                                        options={sectionOptions}
                                        getOptionLabel={(option) => option.label}
                                        value={formData.section}
                                        onChange={(event, newValue) => handleAutocompleteChange('section', newValue)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Section"
                                                placeholder="Sélectionnez une section"
                                                variant="outlined"
                                                size="small"
                                                error={Boolean(errors.section)}
                                                helperText={errors.section}
                                                required
                                                InputProps={{
                                                    ...params.InputProps,
                                                    startAdornment: (
                                                        <>
                                                            <InputAdornment position="start">
                                                                <SubdirectoryArrowRightIcon fontSize="small" />
                                                            </InputAdornment>
                                                            {params.InputProps.startAdornment}
                                                        </>
                                                    )
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* Fourth row - 1 field */}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Motif"
                                        name="reason"
                                        value={formData.reason}
                                        onChange={handleInputChange}
                                        error={Boolean(errors.reason)}
                                        helperText={errors.reason}
                                        required
                                        multiline
                                        rows={3}
                                        placeholder="Soutien aux retraités"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                                                    <DescriptionIcon fontSize="small" />
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>
                            </Grid>
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

CotisationModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    association: PropTypes.object
};

CotisationModal.defaultProps = {
    association: null
};

export default CotisationModal;