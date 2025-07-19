import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton, Tooltip,
    Typography
} from '@mui/material';

// ===============================|| UI DIALOG - SWEET ALERT ||=============================== //

export default function CustomAlertDialog({
    open: externalOpen,
    handleClose: externalHandleClose,
    handleConfirm,
    title = 'Confirmation',
    content = 'Confirmez-vous l\'enregistrement ?',
    confirmBtnText = 'Confirmer',
    cancelBtnText = 'Annuler',
    // Legacy props for backward compatibility
    openLabel = 'Enregistrer',
    variant = 'contained',
    message,
    actionDisabled = true,
    actionVisible = true,
    type = 'submit',
    confirmLabel,
    cancelLabel,
    handleConfirmation,
    TriggerIcon,
    triggerStyle
}) {
    const theme = useTheme();
    const [internalOpen, setInternalOpen] = React.useState(false);

    // Determine if we're using the new API or legacy API
    const isExternalControl = externalOpen !== undefined && externalHandleClose !== undefined;

    // Use either external or internal open state
    const dialogOpen = isExternalControl ? externalOpen : internalOpen;

    const handleClickOpen = () => {
        setInternalOpen(true);
    };

    const handleDialogClose = () => {
        if (isExternalControl) {
            externalHandleClose();
        } else {
            setInternalOpen(false);
        }
    };

    const onConfirm = () => {
        if (isExternalControl && handleConfirm) {
            handleConfirm();
        } else if (handleConfirmation) {
            handleConfirmation();
        }

        if (!isExternalControl) {
            setInternalOpen(false);
        }
    };
    return (
        <>
            {/* Only render trigger if using legacy API and actionVisible is true */}
            {!isExternalControl && actionVisible && (
                TriggerIcon ? 
                    <IconButton 
                        color="secondary" 
                        sx={triggerStyle} 
                        size="large" 
                        disabled={actionDisabled} 
                        variant={variant} 
                        onClick={handleClickOpen}
                    >
                        <Tooltip placement="top" title={openLabel}>
                            {TriggerIcon}
                        </Tooltip>
                    </IconButton> 
                : 
                    <Button 
                        color="secondary" 
                        disabled={actionDisabled} 
                        variant={variant} 
                        onClick={handleClickOpen}
                    >
                        {openLabel}
                    </Button>
            )}

            <Dialog
                open={dialogOpen}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{ p: 3 }}
            >
                {dialogOpen && (
                    <>
                        <DialogTitle id="alert-dialog-title">
                            {title}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                <Typography variant="body2" component="span">
                                    {content || message}
                                </Typography>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions sx={{ pr: 2.5 }}>
                            <Button
                                sx={{ color: theme.palette.error.dark, borderColor: theme.palette.error.dark }}
                                onClick={handleDialogClose}
                                color="secondary"
                            >
                                {cancelBtnText || cancelLabel}
                            </Button>
                            <Button 
                                variant="contained" 
                                size="small" 
                                type={type} 
                                onClick={onConfirm} 
                                autoFocus
                            >
                                {confirmBtnText || confirmLabel}
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </>
    );
}

CustomAlertDialog.propTypes = {
    // New API props
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    handleConfirm: PropTypes.func,
    title: PropTypes.string,
    content: PropTypes.string,
    confirmBtnText: PropTypes.string,
    cancelBtnText: PropTypes.string,

    // Legacy API props
    openLabel: PropTypes.string,
    variant: PropTypes.string,
    message: PropTypes.string,
    actionDisabled: PropTypes.bool,
    actionVisible: PropTypes.bool,
    type: PropTypes.string,
    confirmLabel: PropTypes.string,
    cancelLabel: PropTypes.string,
    handleConfirmation: PropTypes.func,
    TriggerIcon: PropTypes.node,
    triggerStyle: PropTypes.object
};
