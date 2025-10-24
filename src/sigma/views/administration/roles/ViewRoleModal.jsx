import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import {
    TextField,
    Grid,
    Typography,
    Autocomplete,
    Chip,
    CircularProgress,
    Stack
} from '@mui/material';

// project imports
import { usePrivilegesByRole } from '../../../hooks/query/usePrivileges';
import Modal from '../../../components/commons/Modal';

// ==============================|| VIEW ROLE MODAL ||============================== //

const ViewRoleModal = ({ open, handleClose, role }) => {
    // Fetch privileges for the role
    const { data: privileges, isLoading } = usePrivilegesByRole(role?.code);

    return (
        <Modal
            open={open}
            handleClose={handleClose}
            title="Détails du rôle"
            width="md"
            actionVisible={false}
        >
            <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Code"
                        value={role?.code || ''}
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Nom"
                        value={role?.name || ''}
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Description"
                        value={role?.description || ''}
                        InputProps={{ readOnly: true }}
                        multiline
                        rows={2}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Privilèges</Typography>
                    {isLoading ? (
                        <Stack direction="row" justifyContent="center" alignItems="center" sx={{ py: 2 }}>
                            <CircularProgress size={24} />
                        </Stack>
                    ) : (
                        <Autocomplete
                            multiple
                            id="role-privileges"
                            options={privileges || []}
                            getOptionLabel={(option) => `${option.code} - ${option.name}`}
                            value={privileges || []}
                            readOnly
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label="Privilèges du rôle"
                                    placeholder="Aucun privilège"
                                    InputProps={{
                                        ...params.InputProps,
                                        readOnly: true
                                    }}
                                />
                            )}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        label={`${option.code} - ${option.name}`}
                                        {...getTagProps({ index })}
                                    />
                                ))
                            }
                        />
                    )}
                </Grid>
            </Grid>
        </Modal>
    );
};

ViewRoleModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    role: PropTypes.object
};

export default ViewRoleModal;
