import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// material-ui
import {
    TextField,
    Box,
    Grid,
    InputAdornment,
    IconButton,
    FormHelperText,
    Button,
    Typography,
    Link
} from '@mui/material';

// project imports
import Modal from 'e-courrier/components/commons/Modal';
import CustomAlertDialog from 'e-courrier/components/commons/CustomAlertDialog';
import FloatingAlert from 'e-courrier/components/commons/FloatingAlert';
import { userApi } from 'e-courrier/api/administrationApi';
import useAuth from 'hooks/useAuth';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// ==============================|| CHANGE PASSWORD MODAL ||============================== //

const ChangePasswordModal = ({ open, handleClose }) => {
    const { user } = useAuth();

    // Form state
    const [formData, setFormData] = useState({
        userId: user?.userId || '',
        oldPassword: '',
        password: '',
        rePassword: ''
    });

    // Error state
    const [errors, setErrors] = useState({
        oldPassword: '',
        password: '',
        rePassword: ''
    });

    // Password visibility state
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);

    // Confirmation dialog state
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Forgot password dialog state
    const [forgotPasswordDialogOpen, setForgotPasswordDialogOpen] = useState(false);
    const [isSendingResetEmail, setIsSendingResetEmail] = useState(false);

    // Alert state
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('info');

    // Reset form when modal is opened
    useEffect(() => {
        if (open) {
            setFormData({
                userId: user?.userId || '',
                oldPassword: '',
                password: '',
                rePassword: ''
            });
            setErrors({
                oldPassword: '',
                password: '',
                rePassword: ''
            });
        }
    }, [open, user]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Clear error when user types
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    // Toggle password visibility
    const handleTogglePasswordVisibility = (field) => {
        if (field === 'oldPassword') {
            setShowOldPassword(!showOldPassword);
        } else if (field === 'password') {
            setShowPassword(!showPassword);
        } else if (field === 'rePassword') {
            setShowRePassword(!showRePassword);
        }
    };

    // Validate form
    const validateForm = () => {
        let valid = true;
        const newErrors = { ...errors };

        // Validate old password
        if (!formData.oldPassword) {
            newErrors.oldPassword = 'Le mot de passe actuel est requis';
            valid = false;
        }

        // Validate new password
        if (!formData.password) {
            newErrors.password = 'Le nouveau mot de passe est requis';
            valid = false;
        }

        // Validate password confirmation
        if (!formData.rePassword) {
            newErrors.rePassword = 'La confirmation du mot de passe est requise';
            valid = false;
        } else if (formData.password !== formData.rePassword) {
            newErrors.rePassword = 'Les mots de passe ne correspondent pas';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    // Handle form submission
    const handleSubmit = () => {
        if (validateForm()) {
            setConfirmDialogOpen(true);
        }
    };

    // Handle confirmation dialog close
    const handleCloseConfirmDialog = () => {
        setConfirmDialogOpen(false);
    };

    // Handle password change confirmation
    const handleConfirmChangePassword = async () => {
        setIsChangingPassword(true);
        try {
            await userApi.changePassword(formData);
            setIsChangingPassword(false);
            setConfirmDialogOpen(false);
            setAlertMessage('Votre mot de passe a été modifié avec succès');
            setAlertSeverity('success');
            setAlertOpen(true);

            // Close the modal after a short delay
            setTimeout(() => {
                handleClose();
            }, 2000);
        } catch (error) {
            console.error('Error changing password:', error);
            setIsChangingPassword(false);
            setAlertMessage(`Erreur lors de la modification du mot de passe: ${error?.response.data || 'Erreur inconnue'}`);
            setAlertSeverity('error');
            setAlertOpen(true);
        }
    };

    // Handle forgot password link click
    const handleForgotPasswordClick = () => {
        setForgotPasswordDialogOpen(true);
    };

    // Handle forgot password dialog close
    const handleCloseForgotPasswordDialog = () => {
        setForgotPasswordDialogOpen(false);
    };

    // Handle forgot password confirmation
    const handleConfirmForgotPassword = async () => {
        setIsSendingResetEmail(true);
        try {
            await userApi.sendResetPasswordEmail(user.userId);
            setIsSendingResetEmail(false);
            setForgotPasswordDialogOpen(false);
            setAlertMessage('Un lien de réinitialisation de mot de passe a été envoyé à votre adresse email');
            setAlertSeverity('success');
            setAlertOpen(true);
        } catch (error) {
            console.error('Error sending reset password email:', error);
            setIsSendingResetEmail(false);
            setAlertMessage(`Erreur lors de l'envoi du lien de réinitialisation: ${error?.response?.data || 'Erreur inconnue'}`);
            setAlertSeverity('error');
            setAlertOpen(true);
        }
    };

    return (
        <>
            <Modal
                open={open}
                handleClose={handleClose}
                title="Changer mon mot de passe"
                actionVisible={false}
                width="sm"
            >
                <Box sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Mot de passe actuel"
                                name="oldPassword"
                                type={showOldPassword ? 'text' : 'password'}
                                value={formData.oldPassword}
                                onChange={handleChange}
                                error={Boolean(errors.oldPassword)}
                                helperText={errors.oldPassword}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => handleTogglePasswordVisibility('oldPassword')}
                                                edge="end"
                                            >
                                                {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <Box sx={{ mt: 1, textAlign: 'right' }}>
                                <Link 
                                    component="button" 
                                    variant="body2" 
                                    onClick={handleForgotPasswordClick}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    Mot de passe oublié ?
                                </Link>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Nouveau mot de passe"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                error={Boolean(errors.password)}
                                helperText={errors.password}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => handleTogglePasswordVisibility('password')}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Confirmer le nouveau mot de passe"
                                name="rePassword"
                                type={showRePassword ? 'text' : 'password'}
                                value={formData.rePassword}
                                onChange={handleChange}
                                error={Boolean(errors.rePassword)}
                                helperText={errors.rePassword}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => handleTogglePasswordVisibility('rePassword')}
                                                edge="end"
                                            >
                                                {showRePassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                            >
                                Changer le mot de passe
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>

            {/* Confirmation Dialog */}
            <CustomAlertDialog
                open={confirmDialogOpen}
                handleClose={handleCloseConfirmDialog}
                handleConfirm={handleConfirmChangePassword}
                title="Confirmer le changement de mot de passe"
                content="Êtes-vous sûr de vouloir changer votre mot de passe ?"
                confirmBtnText="Confirmer"
                cancelBtnText="Annuler"
                loading={isChangingPassword}
            />

            {/* Forgot Password Dialog */}
            <CustomAlertDialog
                open={forgotPasswordDialogOpen}
                handleClose={handleCloseForgotPasswordDialog}
                handleConfirm={handleConfirmForgotPassword}
                title="Mot de passe oublié"
                content="Un lien de réinitialisation de mot de passe vous sera envoyé par email. Voulez-vous continuer ?"
                confirmBtnText="Envoyer le lien"
                cancelBtnText="Annuler"
                loading={isSendingResetEmail}
            />

            {/* Floating Alert for feedback */}
            <FloatingAlert
                open={alertOpen}
                feedBackMessages={alertMessage}
                severity={alertSeverity}
                timeout={alertSeverity === 'success' ? 2 : 7}
                onClose={() => setAlertOpen(false)}
            />
        </>
    );
};

ChangePasswordModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired
};

export default ChangePasswordModal;
