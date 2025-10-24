import Snackbar from '@mui/material/Snackbar';
import {dispatch} from "../../../store";
import {Alert} from "@mui/material";
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';


const FloatingAlert = ({open, feedBackMessages, severity, timeout = 3, onClose}) => {
    const [feedBackOpen, setFeedBackOpen] = useState(open)

    useEffect(()=>
    {
        setFeedBackOpen(open)
    }, [open, feedBackMessages, severity])

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setFeedBackOpen(false);

        // Notify parent component
        if (onClose) {
            onClose();
        }
    };

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={feedBackOpen}
            autoHideDuration={timeout * 1000} // Convert seconds to milliseconds
            onClose={handleClose}
            sx={{ zIndex: 9999 }} // Ensure it appears above modals
        >
            <Alert 
                style={{color: "white"}} 
                alert 
                elevation={6} 
                variant="filled" 
                severity={severity} 
                onClose={handleClose}
            >
                {
                    Array.isArray(feedBackMessages) ? feedBackMessages?.map((message, index)=>
                    {
                        return <div key={index}>{message}</div>
                    }) : feedBackMessages
                }
            </Alert>
        </Snackbar>
    );
};

FloatingAlert.propTypes = {
    open: PropTypes.bool.isRequired,
    feedBackMessages: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    severity: PropTypes.string,
    timeout: PropTypes.number,
    onClose: PropTypes.func
};
export default FloatingAlert;
