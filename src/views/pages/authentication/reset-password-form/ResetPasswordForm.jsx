import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSearchParams } from 'react-router-dom';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import { useResetPassword } from 'e-courrier/hooks/query/useUsers';
import FloatingAlert from 'e-courrier/components/commons/FloatingAlert';

import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import Logo from 'ui-component/Logo';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// ========================|| RESET PASSWORD FORM ||======================== //

const ResetPasswordForm = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const scriptedRef = useScriptRef();
    const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const [searchParams] = useSearchParams();
    const resetPasswordMutation = useResetPassword();

    const [showPassword, setShowPassword] = React.useState(false);
    const [strength, setStrength] = React.useState(0);
    const [level, setLevel] = React.useState();

    // State for FloatingAlert
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');


    // Get token and userId from URL parameters
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    useEffect(() => {
        changePassword('');
    }, []);

    // Redirect if token or userId is missing
    useEffect(() => {
        if (!token || !userId) {
            setAlertMessage('Lien de réinitialisation invalide. Token ou ID utilisateur manquant.');
            setAlertSeverity('error');
            setAlertOpen(true);

            setTimeout(() => {
                navigate('/login', { replace: true });
            }, 1500);
        }
    }, [token, userId, navigate]);

    return (
        <AuthWrapper1>
            {/* FloatingAlert component */}
            <FloatingAlert 
                open={alertOpen}
                feedBackMessages={alertMessage}
                severity={alertSeverity}
                timeout={3}
                onClose={() => setAlertOpen(false)}
            />

            <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '100vh' }}>
                <Grid item container justifyContent="center" md={12} lg={12} sx={{ my: 3 }}>
                    <AuthCardWrapper>
                        <Grid container spacing={2} justifyContent="center" alignItems="center" textAlign="center">
                            <Grid item xs={12} sx={{ mb: 3 }}>
                                <Logo />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography color="secondary.main" gutterBottom variant={downMD ? 'h3' : 'h2'} align="center">
                                    Réinitialisation de votre mot de passe
                                </Typography>
                                <Typography color="textPrimary" gutterBottom variant="h4" align="center">
                                    Veuillez choisir un nouveau mot de passe.
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Formik
                                    initialValues={{
                                        password: '',
                                        rePassword: '',
                                        submit: null
                                    }}
                                    validationSchema={Yup.object().shape({
                                        password: Yup.string()
                                            .max(255)
                                            .required('Le mot de passe est requis')
                                            ,
                                        rePassword: Yup.string()
                                            .required('La confirmation du mot de passe est requise')
                                            .test(
                                                'rePassword',
                                                'Les mots de passe doivent correspondre',
                                                (rePassword, yup) => yup.parent.password === rePassword
                                            )
                                    })}
                                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                                        try {
                                            // Prepare data for API call
                                            const resetData = {
                                                userId: parseInt(userId),
                                                password: values.password,
                                                rePassword: values.rePassword,
                                                authToken: token
                                            };

                                            // Call API to reset password using the mutation hook
                                            await resetPasswordMutation.mutateAsync(resetData);

                                            setStatus({ success: true });
                                            setSubmitting(false);

                                            setAlertMessage('Votre mot de passe a été réinitialisé avec succès.');
                                            setAlertSeverity('success');
                                            setAlertOpen(true);

                                            // Redirect to login page after successful password reset
                                            setTimeout(() => {
                                                navigate('/login', { replace: true });
                                            }, 1500);
                                        } catch (err) {
                                            setStatus({ success: false });

                                            // Get error messages from response.data
                                            const errorMessages = err.response?.data;

                                            // Set form errors
                                            setErrors({ submit: errorMessages });
                                            setSubmitting(false);

                                            // Set alert state for feedback
                                            setAlertMessage(errorMessages);
                                            setAlertSeverity('error');
                                            setAlertOpen(true);
                                        }
                                    }}
                                >
                                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                                        <form noValidate onSubmit={handleSubmit}>
                                            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
                                                <InputLabel htmlFor="outlined-adornment-password-reset">Mot de passe</InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-password-reset"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={values.password}
                                                    name="password"
                                                    onBlur={handleBlur}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        changePassword(e.target.value);
                                                    }}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleClickShowPassword}
                                                                onMouseDown={handleMouseDownPassword}
                                                                edge="end"
                                                                size="large"
                                                            >
                                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    inputProps={{}}
                                                />
                                            </FormControl>
                                            {touched.password && errors.password && (
                                                <FormControl fullWidth>
                                                    <FormHelperText error id="standard-weight-helper-text-reset" >
                                                        {errors.password}
                                                    </FormHelperText>
                                                </FormControl>
                                            )}
                                            {strength !== 0 && (
                                                <FormControl fullWidth>
                                                    <Box sx={{ mb: 2 }}>
                                                        <Grid container spacing={2} alignItems="center" justifyContent="center">
                                                            <Grid item>
                                                                <Box sx={{ width: 85, height: 8, borderRadius: '7px', bgcolor: level?.color }} />
                                                            </Grid>
                                                            <Grid item>
                                                                <Typography variant="subtitle1" fontSize="0.75rem" align="center">
                                                                    {level?.label}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                </FormControl>
                                            )}

                                            <FormControl
                                                fullWidth
                                                error={Boolean(touched.rePassword && errors.rePassword)}
                                                sx={{ ...theme.typography.customInput }}
                                            >
                                                <InputLabel htmlFor="outlined-adornment-re-password">Confirmer le mot de passe</InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-re-password"
                                                    type="password"
                                                    value={values.rePassword}
                                                    name="rePassword"
                                                    label="Confirmer le mot de passe"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    inputProps={{}}
                                                />
                                            </FormControl>

                                            {touched.rePassword && errors.rePassword && (
                                                <FormControl fullWidth>
                                                    <FormHelperText error id="standard-weight-helper-text-re-password" >
                                                        {errors.rePassword}
                                                    </FormHelperText>
                                                </FormControl>
                                            )}

                                            {errors.submit && (
                                                <Box sx={{ mt: 3 }}>
                                                    <FormHelperText error sx={{ textAlign: 'center' }}>{errors.submit}</FormHelperText>
                                                </Box>
                                            )}
                                            <Box sx={{ mt: 1 }}>
                                                <AnimateButton>
                                                    <Button
                                                        disableElevation
                                                        disabled={isSubmitting}
                                                        fullWidth
                                                        size="large"
                                                        type="submit"
                                                        variant="contained"
                                                        color="secondary"
                                                    >
                                                        Réinitialiser le mot de passe
                                                    </Button>
                                                </AnimateButton>
                                            </Box>
                                        </form>
                                    )}
                                </Formik>
                            </Grid>
                        </Grid>
                    </AuthCardWrapper>
                </Grid>
            </Grid>
        </AuthWrapper1>
    );
};

export default ResetPasswordForm;
