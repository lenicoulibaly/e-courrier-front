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
import { useRoles } from '../../../hooks/query/useAuthorities';
import Pagination from '../../../components/commons/Pagination';
import ViewRoleModal from './ViewRoleModal';

// assets
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

// ==============================|| ROLES LIST ||============================== //

const RolesList = ({ searchTerm, onEditRole }) => {
    const theme = useTheme();
    const [filteredRoles, setFilteredRoles] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    // Fetch roles using the useRoles hook with pagination
    const { data: rolesPage, isLoading, isError, error } = useRoles({ 
        page: page, 
        size: pageSize, 
        key: searchTerm
    });
    const roles = rolesPage?.content;

    // Filter roles based on search term
    useEffect(() => {
        if (roles) {
            let filtered = [...roles];
            setFilteredRoles(filtered);
        }
    }, [roles, searchTerm]);

    // Handle edit button click
    const handleEdit = (role) => {
        if (onEditRole) {
            onEditRole(role);
        }
    };

    // Handle view button click
    const handleView = (role) => {
        setSelectedRole(role);
        setOpenViewModal(true);
    };

    // Handle close view modal
    const handleCloseViewModal = () => {
        setOpenViewModal(false);
        setSelectedRole(null);
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
                <Typography color="error">Error loading roles: {error?.message || 'Unknown error'}</Typography>
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
                            <TableCell>Privilèges</TableCell>
                            <TableCell align="center" sx={{ pr: 3 }}>
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRoles && filteredRoles.length > 0 ? (
                            filteredRoles.map((role, index) => (
                                <TableRow hover key={role.id || index}>
                                    <TableCell sx={{ pl: 3 }}>{role.code}</TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle1">{role.name}</Typography>
                                    </TableCell>
                                    <TableCell>{role.description}</TableCell>
                                    <TableCell>
                                        {role.children && role.children.length > 0 ? (
                                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                                {role.children.slice(0, 3).map((child, idx) => (
                                                    <Chip
                                                        key={idx}
                                                        label={child.code}
                                                        size="small"
                                                        sx={{ my: 0.5 }}
                                                    />
                                                ))}
                                                {role.children.length > 3 && (
                                                    <Chip
                                                        label={`+${role.children.length - 3}`}
                                                        size="small"
                                                        sx={{ my: 0.5 }}
                                                    />
                                                )}
                                            </Stack>
                                        ) : (
                                            <Typography variant="body2">Aucun privilège</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell align="center" sx={{ pr: 3 }}>
                                        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
                                            <Tooltip placement="top" title="Voir les détails">
                                                <IconButton 
                                                    color="info" 
                                                    aria-label="view" 
                                                    size="large"
                                                    onClick={() => handleView(role)}
                                                >
                                                    <VisibilityIcon sx={{ fontSize: '1.1rem' }} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip placement="top" title="Modifier">
                                                <IconButton 
                                                    color="primary" 
                                                    aria-label="edit" 
                                                    size="large"
                                                    onClick={() => handleEdit(role)}
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
                                <TableCell colSpan={5} align="center">
                                    <Typography variant="subtitle1">Aucun rôle trouvé</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {rolesPage && (
                <Pagination 
                    totalPages={rolesPage.totalPages} 
                    currentPage={page} 
                    onPageChange={handlePageChange}
                    currentSize={pageSize}
                    onSizeChange={handlePageSizeChange}
                />
            )}

            {/* View Role Modal */}
            {selectedRole && (
                <ViewRoleModal 
                    open={openViewModal} 
                    handleClose={handleCloseViewModal} 
                    role={selectedRole} 
                />
            )}
        </>
    );
};

RolesList.propTypes = {
    searchTerm: PropTypes.string,
    onEditRole: PropTypes.func
};

export default RolesList;
