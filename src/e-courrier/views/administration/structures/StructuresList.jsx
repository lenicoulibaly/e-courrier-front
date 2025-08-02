import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
    CircularProgress
} from '@mui/material';

// project imports
import { useStructures } from '../../../hooks/query/useStructures';
import Pagination from '../../../components/commons/Pagination';
import FloatingAlert from '../../../components/commons/FloatingAlert';

// assets
import EditIcon from '@mui/icons-material/Edit';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

// ==============================|| STRUCTURES LIST ||============================== //

const StructuresList = ({ searchTerm, typeCode, onEditStructure, onChangeAnchor }) => {
    const theme = useTheme();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    // State for alerts
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('info');

    // Fetch structures using the useStructures hook with pagination
    const params = {
        page: page,
        size: pageSize,
        key: searchTerm
    };

    // Only add typeCode if it's not empty
    if (typeCode) {
        params.typeCode = typeCode;
    }

    const { data: structuresPage, isLoading, isError, error } = useStructures(params);

    // Handle error
    useEffect(() => {
        if (isError && error) {
            setAlertMessage(error.message || 'Une erreur est survenue lors du chargement des structures');
            setAlertSeverity('error');
            setAlertOpen(true);
        }
    }, [isError, error]);

    // Handle page change
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    // Handle page size change
    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setPage(0); // Reset to first page when changing page size
    };

    // Handle edit button click
    const handleEdit = (structure) => {
        if (onEditStructure) {
            onEditStructure(structure);
        }
    };

    // Handle change anchor button click
    const handleChangeAnchor = (structure) => {
        if (onChangeAnchor) {
            onChangeAnchor(structure);
        }
    };

    // Handle alert close
    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    return (
        <>
            <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nom</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Téléphone</TableCell>
                            <TableCell>Adresse</TableCell>
                            <TableCell>Structure parente</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <CircularProgress color="primary" />
                                </TableCell>
                            </TableRow>
                        ) : structuresPage?.content?.length > 0 ? (
                            structuresPage.content.map((structure) => (
                                <TableRow key={structure.strId}>
                                    <TableCell>
                                        <Typography variant="subtitle1">{structure.strName}</Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            {structure.chaineSigles}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{structure.strTypeName}</TableCell>
                                    <TableCell>{structure.strTel}</TableCell>
                                    <TableCell>{structure.strAddress}</TableCell>
                                    <TableCell>{structure.parentName}</TableCell>
                                    <TableCell align="center">
                                        <Stack direction="row" justifyContent="center" spacing={1}>
                                            <Tooltip title="Modifier">
                                                <IconButton 
                                                    color="primary" 
                                                    size="small" 
                                                    onClick={() => handleEdit(structure)}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Changer l'ancrage institutionnel">
                                                <IconButton 
                                                    color="secondary" 
                                                    size="small" 
                                                    onClick={() => handleChangeAnchor(structure)}
                                                >
                                                    <AccountTreeIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <Typography variant="subtitle1">Aucune structure trouvée</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {structuresPage && (
                <Pagination
                    totalPages={structuresPage.totalPages}
                    currentPage={page}
                    onPageChange={handlePageChange}
                    currentSize={pageSize}
                    onSizeChange={handlePageSizeChange}
                    totalCount={structuresPage.totalElements}
                    sx={{ mt: 3 }}
                />
            )}

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

StructuresList.propTypes = {
    searchTerm: PropTypes.string,
    typeCode: PropTypes.string,
    onEditStructure: PropTypes.func,
    onChangeAnchor: PropTypes.func
};

export default StructuresList;
