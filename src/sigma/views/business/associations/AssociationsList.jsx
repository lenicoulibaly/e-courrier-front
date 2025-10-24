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
    CircularProgress,
    Menu,
    MenuItem,
    Avatar
} from '@mui/material';

// project imports
import Pagination from '../../../components/commons/Pagination';
import FloatingAlert from '../../../components/commons/FloatingAlert';
import AssociationModal from './AssociationModal';
import CotisationModal from '../cotisations/CotisationModal';

// assets
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconCoin } from '@tabler/icons-react';

// ==============================|| ASSOCIATIONS LIST ||============================== //

const AssociationsList = ({ searchTerm }) => {
    const theme = useTheme();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);

    // State for alerts
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('info');

    // State for action menu
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedAssociation, setSelectedAssociation] = useState(null);

    // State for edit modal
    const [openEditModal, setOpenEditModal] = useState(false);

    // State for cotisation modal
    const [openCotisationModal, setOpenCotisationModal] = useState(false);

    // Mock data for associations
    const [associationsData, setAssociationsData] = useState({
        content: [
            {
                id: 1,
                name: 'Mutuelle des Agents des Finances Générales',
                acronym: 'MAFIB',
                location: 'Abidjan/Plateau/Cité Financière',
                membershipFee: 10000,
                logo: null
            },
            {
                id: 2,
                name: 'Syndicat des Agents des Finances Générales',
                acronym: 'SYNAFIG',
                location: 'Abidjan/Plateau/Cité Financière',
                membershipFee: 15000,
                logo: null
            }
        ],
        totalPages: 1,
        totalElements: 2
    });

    // Filter associations based on search term
    useEffect(() => {
        if (searchTerm) {
            const filteredContent = associationsData.content.filter(
                association => 
                    association.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    association.acronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    association.location.toLowerCase().includes(searchTerm.toLowerCase())
            );

            setAssociationsData({
                ...associationsData,
                content: filteredContent,
                totalElements: filteredContent.length,
                totalPages: Math.ceil(filteredContent.length / pageSize)
            });
        } else {
            // Reset to original data
            setAssociationsData({
                content: [
                    {
                        id: 1,
                        name: 'Mutuelle des Agents des Finances Générales',
                        acronym: 'MAFIB',
                        location: 'Abidjan/Plateau/Cité Financière',
                        membershipFee: 10000,
                        logo: null
                    },
                    {
                        id: 2,
                        name: 'Syndicat des Agents des Finances Générales',
                        acronym: 'SYNAFIG',
                        location: 'Abidjan/Plateau/Cité Financière',
                        membershipFee: 15000,
                        logo: null
                    }
                ],
                totalPages: 1,
                totalElements: 2
            });
        }
    }, [searchTerm, pageSize]);

    // Handle page change
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    // Handle page size change
    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setPage(0); // Reset to first page when changing page size
    };

    // Handle action menu open
    const handleActionMenuOpen = (event, association) => {
        setAnchorEl(event.currentTarget);
        setSelectedAssociation(association);
    };

    // Handle action menu close
    const handleActionMenuClose = () => {
        setAnchorEl(null);
        setSelectedAssociation(null);
    };

    // Handle action menu item click
    const handleActionClick = (action) => {
        if (selectedAssociation) {
            if (action === 'edit') {
                setOpenEditModal(true);
                // Don't close the menu yet for edit action to keep selectedAssociation available
                setAnchorEl(null); // Just hide the menu without clearing selectedAssociation
            } else if (action === 'add-contribution') {
                setOpenCotisationModal(true);
                // Don't close the menu yet for cotisation action to keep selectedAssociation available
                setAnchorEl(null); // Just hide the menu without clearing selectedAssociation
            } else {
                // Here you would implement the other actions
                setAlertMessage(`Action "${action}" sur ${selectedAssociation.name}`);
                setAlertSeverity('info');
                setAlertOpen(true);
                handleActionMenuClose(); // Close menu and clear selectedAssociation for other actions
            }
        } else {
            handleActionMenuClose();
        }
    };

    // Handle close edit modal
    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setSelectedAssociation(null); // Clear selectedAssociation when modal is closed
    };

    // Handle close cotisation modal
    const handleCloseCotisationModal = () => {
        setOpenCotisationModal(false);
        setSelectedAssociation(null); // Clear selectedAssociation when modal is closed
    };

    // Handle alert close
    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-FR').format(amount);
    };

    return (
        <>
            <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>N°</TableCell>
                            <TableCell>Nom</TableCell>
                            <TableCell>Sigle</TableCell>
                            <TableCell>Situation géographique</TableCell>
                            <TableCell>Droit d'adhésion (FCFA)</TableCell>
                            <TableCell>Logo</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <CircularProgress color="primary" />
                                </TableCell>
                            </TableRow>
                        ) : associationsData?.content?.length > 0 ? (
                            associationsData.content.map((association) => (
                                <TableRow key={association.id}>
                                    <TableCell>{association.id}</TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle1">{association.name}</Typography>
                                    </TableCell>
                                    <TableCell>{association.acronym}</TableCell>
                                    <TableCell>{association.location}</TableCell>
                                    <TableCell>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <IconCoin size="1rem" />
                                            <Typography>{formatCurrency(association.membershipFee)}</Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        {association.logo ? (
                                            <Avatar src={association.logo} alt={association.name} sx={{ width: 40, height: 40 }} />
                                        ) : (
                                            <Avatar sx={{ width: 40, height: 40, bgcolor: theme.palette.primary.light }}>
                                                {association.acronym.charAt(0)}
                                            </Avatar>
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton 
                                            color="primary" 
                                            size="small" 
                                            onClick={(e) => handleActionMenuOpen(e, association)}
                                        >
                                            <MoreVertIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <Typography variant="subtitle1">Aucune association trouvée</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {associationsData && (
                <Pagination
                    totalPages={associationsData.totalPages}
                    currentPage={page}
                    onPageChange={handlePageChange}
                    currentSize={pageSize}
                    onSizeChange={handlePageSizeChange}
                    totalCount={associationsData.totalElements}
                    sx={{ mt: 3 }}
                />
            )}

            {/* Action Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleActionMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={() => handleActionClick('details')}>Détails</MenuItem>
                <MenuItem onClick={() => handleActionClick('edit')}>Modifier</MenuItem>
                <MenuItem onClick={() => handleActionClick('add-contribution')}>Ajouter une cotisation</MenuItem>
                <MenuItem onClick={() => handleActionClick('sections-list')}>Liste des sections</MenuItem>
                <MenuItem onClick={() => handleActionClick('members-list')}>Liste des membres</MenuItem>
                <MenuItem onClick={() => handleActionClick('membership-requests')}>Demandes d'adhésion</MenuItem>
                <MenuItem onClick={() => handleActionClick('edit-membership-form')}>Éditer la fiche d'adhésion</MenuItem>
            </Menu>

            {/* Alert for feedback */}
            <FloatingAlert
                open={alertOpen}
                feedBackMessages={alertMessage}
                severity={alertSeverity}
                timeout={alertSeverity === 'error' ? 7 : 3}
                onClose={handleAlertClose}
            />

            {/* Edit Association Modal */}
            {selectedAssociation && (
                <AssociationModal
                    open={openEditModal}
                    handleClose={handleCloseEditModal}
                    association={selectedAssociation}
                    isEdit={true}
                />
            )}

            {/* Add Cotisation Modal */}
            {selectedAssociation && (
                <CotisationModal
                    open={openCotisationModal}
                    handleClose={handleCloseCotisationModal}
                    association={selectedAssociation}
                />
            )}
        </>
    );
};

AssociationsList.propTypes = {
    searchTerm: PropTypes.string
};

export default AssociationsList;
