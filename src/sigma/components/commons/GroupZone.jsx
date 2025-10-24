import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useTheme} from '@mui/material/styles';
function GroupZone({children, tilte}) {
    const theme = useTheme();
    const groupZoneStyles = {
        paper: {
            padding: '20px',
            marginBottom: '20px',
            position: 'relative',
            borderStyle: 'dotted',
            borderWidth: '1px',
            backgroundColor: theme.palette.background.default, // Utilise la couleur de fond du thème
            color: theme.palette.text.primary, // Utilise la couleur du texte du thème
        },
        title: {
            position: 'absolute',
            top: '-21px',
            left: '10px',
            padding: '10px',
            background: theme.palette.background.paper, // Utilise la couleur de fond du papier du thème
            color: theme.palette.text.primary, // Utilise la couleur du texte du thème
            zIndex: 1,
        },
    };
    return (
        <Paper elevation={0} style={groupZoneStyles.paper}>
            <Typography variant="h5" style={groupZoneStyles.title}>
                {tilte}
            </Typography>
            {children}
        </Paper>
    );
}

export default GroupZone;