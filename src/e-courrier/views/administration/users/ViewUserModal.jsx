import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import {
    Box,
    Button,
    Divider,
    Grid,
    Typography,
    Chip
} from '@mui/material';

// project imports
import Modal from '../../../components/commons/Modal';

// ==============================|| VIEW USER MODAL ||============================== //

const ViewUserModal = ({ open, handleClose, user }) => {
    if (!user) return null;

    return (
        <Modal
            open={open}
            handleClose={handleClose}
            title="Détails de l'utilisateur"
            maxWidth="md"
            actions={
                <Box display="flex" justifyContent="flex-end">
                    <Button variant="contained" color="primary" onClick={handleClose}>
                        Fermer
                    </Button>
                </Box>
            }
        >
            <Grid container spacing={2}>
                {/* Personal Information Section */}
                <Grid item xs={12}>
                    <Typography variant="h5" gutterBottom>
                        Informations personnelles
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" color="textSecondary">
                        Nom complet
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        {`${user.firstName} ${user.lastName}`}
                    </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" color="textSecondary">
                        Email
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        {user.email}
                    </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" color="textSecondary">
                        Téléphone
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        {user.tel || 'Non renseigné'}
                    </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" color="textSecondary">
                        Dernière connexion
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Jamais'}
                    </Typography>
                </Grid>
                
                {/* Structure Information Section */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                    <Typography variant="h5" gutterBottom>
                        Structure
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" color="textSecondary">
                        Nom de la structure
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        {user.strName || 'Non renseigné'}
                    </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" color="textSecondary">
                        Sigle
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        {user.strSigle ? (
                            <Chip label={user.strSigle} size="small" />
                        ) : (
                            'Non renseigné'
                        )}
                    </Typography>
                </Grid>
            </Grid>
        </Modal>
    );
};

ViewUserModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    user: PropTypes.object
};

export default ViewUserModal;