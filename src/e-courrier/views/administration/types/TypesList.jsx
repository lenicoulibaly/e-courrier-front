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
import { useTypes } from '../../../hooks/query/useTypes';

// assets
import EditIcon from '@mui/icons-material/Edit';

// ==============================|| TYPES LIST ||============================== //

const TypesList = ({ searchTerm, privilegeTypeCode, onEditType }) => {
    const theme = useTheme();
    const [filteredTypes, setFilteredTypes] = useState([]);

    // Fetch types using the useTypes hook
    const { data: typesPage, isLoading, isError, error } = useTypes();
    const types = typesPage?.content;
    // Filter types based on search term and privilegeTypeCode
    useEffect(() => {
        if (types) {
            let filtered = [...types];
            
            // Filter by search term
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                filtered = filtered.filter(
                    (type) => 
                        type.code?.toLowerCase().includes(searchLower) || 
                        type.label?.toLowerCase().includes(searchLower) ||
                        type.description?.toLowerCase().includes(searchLower)
                );
            }
            
            // Filter by privilegeTypeCode
            if (privilegeTypeCode) {
                filtered = filtered.filter(
                    (type) => type.privilegeTypeCode === privilegeTypeCode
                );
            }
            
            setFilteredTypes(filtered);
        }
    }, [types, searchTerm, privilegeTypeCode]);

    // Handle edit button click
    const handleEdit = (type) => {
        if (onEditType) {
            onEditType(type);
        }
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
        <TableContainer>
            <Table>
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
                                    <Stack direction="row" justifyContent="center" alignItems="center">
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
    );
};

TypesList.propTypes = {
    searchTerm: PropTypes.string,
    privilegeTypeCode: PropTypes.string,
    onEditType: PropTypes.func
};

export default TypesList;