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
import { useSearchPrivileges } from '../../../hooks/query';
import Pagination from '../../../components/commons/Pagination';

// assets
import EditIcon from '@mui/icons-material/Edit';

// ==============================|| PRIVILEGES LIST ||============================== //

const PrivilegesList = ({ searchTerm, privilegeTypeCodes, onEditPrivilege }) => {
    const theme = useTheme();
    const [filteredPrivileges, setFilteredPrivileges] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    // Fetch privileges using the useSearchPrivileges hook with pagination and type filtering
    const { data: privilegesPage, isLoading, isError, error } = useSearchPrivileges({ 
        page: page, 
        size: pageSize, 
        key: searchTerm,
        privilegeTypeCodes: privilegeTypeCodes && privilegeTypeCodes.length > 0 ? privilegeTypeCodes : undefined
    });
    const privileges = privilegesPage?.content;

    // Filter privileges based on search term and type codes
    useEffect(() => {
        if (privileges) {
            let filtered = [...privileges];
            setFilteredPrivileges(filtered);
        }
    }, [privileges, searchTerm, privilegeTypeCodes]);

    // Handle edit button click
    const handleEdit = (privilege) => {
        if (onEditPrivilege) {
            onEditPrivilege(privilege);
        }
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
                <Typography color="error">Error loading privileges: {error?.message || 'Unknown error'}</Typography>
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
                            <TableCell>Nom</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Type de Privilège</TableCell>
                            <TableCell align="center" sx={{ pr: 3 }}>
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredPrivileges && filteredPrivileges.length > 0 ? (
                            filteredPrivileges.map((privilege, index) => (
                                <TableRow hover key={privilege.id || index}>
                                    <TableCell sx={{ pl: 3 }}>{privilege.code}</TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle1">{privilege.name}</Typography>
                                    </TableCell>
                                    <TableCell>{privilege.description}</TableCell>
                                    <TableCell>{privilege.privilegeTypeCode}</TableCell>
                                    <TableCell align="center" sx={{ pr: 3 }}>
                                        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
                                            <Tooltip placement="top" title="Modifier">
                                                <IconButton 
                                                    color="primary" 
                                                    aria-label="edit" 
                                                    size="large"
                                                    onClick={() => handleEdit(privilege)}
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
                                    <Typography variant="subtitle1">Aucun privilège trouvé</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {privilegesPage && (
                <Pagination 
                    totalPages={privilegesPage.totalPages} 
                    currentPage={page} 
                    onPageChange={handlePageChange}
                    currentSize={pageSize}
                    onSizeChange={handlePageSizeChange}
                    totalCount={privilegesPage.totalElements}
                />
            )}
        </>
    );
};

PrivilegesList.propTypes = {
    searchTerm: PropTypes.string,
    privilegeTypeCodes: PropTypes.arrayOf(PropTypes.string),
    onEditPrivilege: PropTypes.func
};

export default PrivilegesList;
