import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import {
    Button,
    Chip,
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
import { ThemeMode } from 'config';
import { useSearchTypes } from '../../../hooks/query/useSearchTypes';
import Pagination from '../../../components/commons/Pagination';
import ConfigureSubtypesModal from './ConfigureSubtypesModal';

// assets
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';

// ==============================|| TYPES LIST ||============================== //

const TypesList = ({ searchTerm, groupCodes, onEditType }) => {
    const theme = useTheme();
    const [filteredTypes, setFilteredTypes] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(3);
    const [configureSubtypesModalOpen, setConfigureSubtypesModalOpen] = useState(false);
    const [selectedType, setSelectedType] = useState(null);

    // Fetch types using the useTypes hook with pagination
    const { data: typesPage, isLoading, isError, error } = useSearchTypes({ page: page, size: pageSize, key: searchTerm, groupCodes: groupCodes});
    const types = typesPage?.content;
    // Filter types based on search term and groups
    useEffect(() => {
        if (types) {
            let filtered = [...types];
            setFilteredTypes(filtered);
        }
    }, [types, searchTerm, groupCodes]);

    // Handle edit button click
    const handleEdit = (type) => {
        if (onEditType)
        {
            onEditType(type);
        }
    };

    // Handle configure subtypes button click
    const handleConfigureSubtypes = (type) => {
        setSelectedType(type);
        setConfigureSubtypesModalOpen(true);
    };

    // Handle close configure subtypes modal
    const handleCloseConfigureSubtypesModal = () => {
        setConfigureSubtypesModalOpen(false);
        setSelectedType(null);
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    // Handle page size change
    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setPage(0); // Reset to first page when changing page size
    };

    // Show loading state
    if (isLoading) {
        return (
            <Stack direction="row" justifyContent="center" alignItems="center" sx={{ py: 3 }}>
                <CircularProgress />
            </Stack>
        );
    }

    // Show error state
    if (isError) {
        return (
            <Stack direction="row" justifyContent="center" alignItems="center" sx={{ py: 3 }}>
                <Typography color="error">Error loading types: {error?.message || 'Unknown error'}</Typography>
            </Stack>
        );
    }

    return (
        <>
            <TableContainer sx={{ border: 1, borderColor: 'divider', borderRadius: 1, maxHeight: 440 }}>
                <Table sx={{ minWidth: 350 }} aria-label="simple table" size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ pl: 3 }}>Code</TableCell>
                            <TableCell>Label</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Group</TableCell>
                            <TableCell align="center" sx={{ pr: 3 }}>
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredTypes.length > 0 ? (
                            filteredTypes.map((type, index) => (
                                <TableRow hover key={type.id || index}>
                                    <TableCell sx={{ pl: 3 }}>{type.code}</TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle1">{type.name}</Typography>
                                    </TableCell>
                                    <TableCell>{type.description}</TableCell>
                                    <TableCell>{type.groupCode}</TableCell>
                                    <TableCell align="center" sx={{ pr: 3 }}>
                                        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
                                            <Tooltip placement="top" title="Edit">
                                                <IconButton 
                                                    color="primary" 
                                                    aria-label="edit" 
                                                    size="large"
                                                    onClick={() => handleEdit(type)}
                                                >
                                                    <EditIcon sx={{ fontSize: '1.1rem' }} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip placement="top" title="Configurer les sous-types">
                                                <IconButton 
                                                    color="secondary" 
                                                    aria-label="configure-subtypes" 
                                                    size="large"
                                                    onClick={() => handleConfigureSubtypes(type)}
                                                >
                                                    <SettingsIcon sx={{ fontSize: '1.1rem' }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <Typography variant="subtitle1">No types found</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {typesPage && (
                <Pagination 
                    totalPages={typesPage.totalPages} 
                    currentPage={page} 
                    onPageChange={handlePageChange}
                    currentSize={pageSize}
                    onSizeChange={handlePageSizeChange}
                />
            )}

            {/* Modal for configuring subtypes */}
            <ConfigureSubtypesModal
                open={configureSubtypesModalOpen}
                handleClose={handleCloseConfigureSubtypesModal}
                type={selectedType}
            />
        </>
    );
};

TypesList.propTypes = {
    searchTerm: PropTypes.string,
    groupCodes: PropTypes.array,
    onEditType: PropTypes.func
};

export default TypesList;
