import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
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
import { ThemeMode } from 'config';
import { useSearchProfile } from '../../../hooks/query/useAuthorities';
import Pagination from '../../../components/commons/Pagination';

// assets
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

// ==============================|| PROFILES LIST ||============================== //

const ProfilesList = ({ searchTerm, onEditProfile, onViewProfile }) => {
    const theme = useTheme();
    const [filteredProfiles, setFilteredProfiles] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    // Fetch profiles using the useSearchProfile hook with pagination
    const { data: profilesPage, isLoading, isError, error } = useSearchProfile({ 
        page: page, 
        size: pageSize, 
        key: searchTerm
    });
    const profiles = profilesPage?.content;

    // Filter profiles based on search term
    useEffect(() => {
        if (profiles) {
            let filtered = [...profiles];
            setFilteredProfiles(filtered);
        }
    }, [profiles, searchTerm]);

    // Handle edit button click
    const handleEdit = (profile) => {
        if (onEditProfile) {
            onEditProfile(profile);
        }
    };

    // Handle view button click
    const handleView = (profile) => {
        if (onViewProfile) {
            onViewProfile(profile);
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
                <Typography color="error">Error loading profiles: {error?.message || 'Unknown error'}</Typography>
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
                            <TableCell align="center" sx={{ pr: 3 }}>
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredProfiles && filteredProfiles.length > 0 ? (
                            filteredProfiles.map((profile, index) => (
                                <TableRow hover key={profile.id || index}>
                                    <TableCell sx={{ pl: 3 }}>{profile.code}</TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle1">{profile.name}</Typography>
                                    </TableCell>
                                    <TableCell>{profile.description}</TableCell>
                                    <TableCell align="center" sx={{ pr: 3 }}>
                                        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
                                            <Tooltip placement="top" title="Voir les détails">
                                                <IconButton 
                                                    color="info" 
                                                    aria-label="view" 
                                                    size="large"
                                                    onClick={() => handleView(profile)}
                                                >
                                                    <VisibilityIcon sx={{ fontSize: '1.1rem' }} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip placement="top" title="Modifier">
                                                <IconButton 
                                                    color="primary" 
                                                    aria-label="edit" 
                                                    size="large"
                                                    onClick={() => handleEdit(profile)}
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
                                <TableCell colSpan={4} align="center">
                                    <Typography variant="subtitle1">Aucun profil trouvé</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {profilesPage && (
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                        Total: {profilesPage.totalElements} profil(s)
                    </Typography>
                    <Pagination 
                        totalPages={profilesPage.totalPages} 
                        currentPage={page} 
                        onPageChange={handlePageChange}
                        currentSize={pageSize}
                        onSizeChange={handlePageSizeChange}
                    />
                </Stack>
            )}
        </>
    );
};

ProfilesList.propTypes = {
    searchTerm: PropTypes.string,
    onEditProfile: PropTypes.func,
    onViewProfile: PropTypes.func
};

export default ProfilesList;