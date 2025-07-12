import Snackbar from '@mui/material/Snackbar';
import {dispatch} from "../../../store";
import {Alert} from "@mui/material";
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';


const FloatingAlert = ({open, feedBackMessages, severity}) => {
    const [feedBackOpen, setFeedBackOpen] = useState(open)
    useEffect(()=>
    {

    }, [open, feedBackMessages, severity])
    useEffect(()=>
    {
        setFeedBackOpen(open)
    }, [feedBackMessages])
    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={feedBackOpen}
            autoHideDuration={3000} // Adjust the duration as needed

        >
            <Alert style={{color: "white"}} alert elevation={6} variant="filled" severity={severity} onClose={() => setFeedBackOpen(false)}>
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
    severity: PropTypes.string
};
export default FloatingAlert;
