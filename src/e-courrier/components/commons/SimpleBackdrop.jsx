import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function SimpleBackdrop({open}) {

    return (
        <div>
            <Backdrop sx={{ color: '#fff', zIndex: 15000}} open={open}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}
