import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import {
    Button,
    Chip,
    IconButton,
    Menu,
    MenuItem,
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
import { useSearchUsers, useBlockUser, useUnblockUser, useSendActivationEmail } from '../../../hooks/query/useUsers';
import Pagination from '../../../components/commons/Pagination';
import Modal from '../../../components/commons/Modal';
import CustomAlertDialog from '../../../components/commons/CustomAlertDialog';
import FloatingAlert from '../../../components/commons/FloatingAlert';

// assets
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BlockIcon from '@mui/icons-material/Block';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import EmailIcon from '@mui/icons-material/Email';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import StarIcon from '@mui/icons-material/Star';
import ListIcon from '@mui/icons-material/List';
import AddUserProfileModal from './AddUserProfileModal';

// ==============================|| USERS LIST ||============================== //

const UsersList = ({ searchTerm, structureId, userId, onEditUser, onViewUser, onViewUserProfiles }) => {
    const theme = useTheme();
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [openAddProfileModal, setOpenAddProfileModal] = useState(false);
    const [openBlockDialog, setOpenBlockDialog] = useState(false);
    const [openUnblockDialog, setOpenUnblockDialog] = useState(false);
    const [openActivationDialog, setOpenActivationDialog] = useState(false);

    // State for alerts
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('info');

    // Fetch users using the useSearchUsers hook with pagination
    const { data: usersPage, isLoading, isError, error } = useSearchUsers({ 
        page: page, 
        size: pageSize, 
        key: searchTerm,
        strId: structureId,
        userId: userId
    });
    const users = usersPage?.content;

    // Initialize mutation hooks
    const blockUserMutation = useBlockUser();
    const unblockUserMutation = useUnblockUser();
    const sendActivationEmailMutation = useSendActivationEmail();

    // Filter users based on search term and structure
    useEffect(() => {
        if (users) {
            let filtered = [...users];
            setFilteredUsers(filtered);
        }
    }, [users, searchTerm, structureId]);

    // Handle menu open
    const handleMenuOpen = (event, user) => {
        setAnchorEl(event.currentTarget);
        setSelectedUser(user);
    };

    // Handle menu close
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Handle view button click
    const handleView = () => {
        handleMenuClose();
        if (onViewUser && selectedUser) {
            onViewUser(selectedUser);
        }
    };

    // Handle edit button click
    const handleEdit = () => {
        handleMenuClose();
        if (onEditUser && selectedUser) {
            onEditUser(selectedUser);
        }
    };

    // Handle block user
    const handleBlockUser = () => {
        handleMenuClose();
        setOpenBlockDialog(true);
    };

    // Handle unblock user
    const handleUnblockUser = () => {
        handleMenuClose();
        setOpenUnblockDialog(true);
    };

    // Handle send activation link
    const handleSendActivation = () => {
        handleMenuClose();
        setOpenActivationDialog(true);
    };

    // Handle add profile
    const handleAddProfile = () => {
        handleMenuClose();
        setOpenAddProfileModal(true);
    };


    // Handle view profiles
    const handleViewProfiles = () => {
        handleMenuClose();
        if (onViewUserProfiles && selectedUser) {
            onViewUserProfiles(selectedUser.userId, selectedUser);
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

    // Handle close modals and dialogs
    const handleCloseAddProfileModal = () => {
        setOpenAddProfileModal(false);
    };

    const handleCloseBlockDialog = () => {
        setOpenBlockDialog(false);
    };

    const handleCloseUnblockDialog = () => {
        setOpenUnblockDialog(false);
    };

    const handleCloseActivationDialog = () => {
        setOpenActivationDialog(false);
    };


    // Handle confirm actions
    const handleConfirmBlock = () => {
        if (selectedUser) {
            blockUserMutation.mutate(selectedUser.userId, {
                onSuccess: () => {
                    setOpenBlockDialog(false);
                    setAlertMessage(`L'utilisateur ${selectedUser.firstName} ${selectedUser.lastName} a été bloqué avec succès`);
                    setAlertSeverity('success');
                    setAlertOpen(true);
                },
                onError: (error) => {
                    setOpenBlockDialog(false);
                    console.error('Error blocking user:', error);
                    setAlertMessage(`Erreur lors du blocage de l'utilisateur: ${error?.response?.data || error?.message || 'Erreur inconnue'}`);
                    setAlertSeverity('error');
                    setAlertOpen(true);
                }
            });
        }
    };

    const handleConfirmUnblock = () => {
        if (selectedUser) {
            unblockUserMutation.mutate(selectedUser.userId, {
                onSuccess: () => {
                    setOpenUnblockDialog(false);
                    setAlertMessage(`L'utilisateur ${selectedUser.firstName} ${selectedUser.lastName} a été débloqué avec succès`);
                    setAlertSeverity('success');
                    setAlertOpen(true);
                },
                onError: (error) => {
                    setOpenUnblockDialog(false);
                    console.error('Error unblocking user:', error);
                    setAlertMessage(`Erreur lors du déblocage de l'utilisateur: ${error?.response?.data || error?.message || 'Erreur inconnue'}`);
                    setAlertSeverity('error');
                    setAlertOpen(true);
                }
            });
        }
    };

    const handleConfirmActivation = () => {
        if (selectedUser) {
            sendActivationEmailMutation.mutate(selectedUser.userId, {
                onSuccess: () => {
                    setOpenActivationDialog(false);
                    setAlertMessage(`Un lien d'activation a été envoyé à ${selectedUser.firstName} ${selectedUser.lastName} avec succès`);
                    setAlertSeverity('success');
                    setAlertOpen(true);
                },
                onError: (error) => {
                    setOpenActivationDialog(false);
                    console.error('Error sending activation email:', error);
                    setAlertMessage(`Erreur lors de l'envoi du lien d'activation: ${error?.response?.data || error?.message || 'Erreur inconnue'}`);
                    setAlertSeverity('error');
                    setAlertOpen(true);
                }
            });
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
                <Typography color="error">Error loading users: {error?.message || 'Unknown error'}</Typography>
            </Stack>
        );
    }

    return (
        <>
            <TableContainer sx={{ border: 1, borderColor: 'divider', borderRadius: 1, maxHeight: 440 }}>
                <Table sx={{ minWidth: 350 }} aria-label="simple table" size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nom</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Téléphone</TableCell>
                            <TableCell>Structure</TableCell>
                            <TableCell>Dernière connexion</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers && filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <TableRow
                                    hover
                                    key={user.userId}
                                    sx={{
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        backgroundColor: !user.notBlocked 
                                            ? alpha(theme.palette.grey[500], 0.2)
                                            : theme.palette.mode === ThemeMode.DARK ? 'inherit' : 'inherit'
                                    }}
                                >
                                    <TableCell>
                                        <Typography variant="subtitle1">{`${user.firstName} ${user.lastName}`}</Typography>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.tel}</TableCell>
                                    <TableCell>
                                        <Tooltip title={user.strName} placement="top">
                                            <Typography variant="subtitle2">{user.strSigle}</Typography>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Jamais'}</TableCell>
                                    <TableCell align="center">
                                        <IconButton 
                                            size="small" 
                                            onClick={(event) => handleMenuOpen(event, user)}
                                            aria-controls={`user-menu-${user.userId}`}
                                            aria-haspopup="true"
                                        >
                                            <MoreVertIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <Typography variant="subtitle1">Aucun utilisateur trouvé</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            {usersPage && (
                <Pagination
                    page={page}
                    count={usersPage.totalPages}
                    rowsPerPage={pageSize}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handlePageSizeChange}
                    totalCount={usersPage.totalElements}
                />
            )}

            {/* Actions Menu */}
            <Menu
                id={selectedUser ? `user-menu-${selectedUser.userId}` : 'user-menu'}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={handleView}>
                    <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
                    Voir le détail
                </MenuItem>
                <MenuItem onClick={handleEdit}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} />
                    Modifier l'utilisateur
                </MenuItem>
                {selectedUser?.notBlocked && (
                    <MenuItem onClick={handleBlockUser}>
                        <BlockIcon fontSize="small" sx={{ mr: 1 }} />
                        Bloquer l'utilisateur
                    </MenuItem>
                )}
                {!selectedUser?.notBlocked && (
                    <MenuItem onClick={handleUnblockUser}>
                        <LockOpenIcon fontSize="small" sx={{ mr: 1 }} />
                        Débloquer l'utilisateur
                    </MenuItem>
                )}
                <MenuItem onClick={handleSendActivation}>
                    <EmailIcon fontSize="small" sx={{ mr: 1 }} />
                    Envoyer un lien d'activation
                </MenuItem>
                <MenuItem onClick={handleAddProfile}>
                    <PersonAddIcon fontSize="small" sx={{ mr: 1 }} />
                    Ajouter un profil
                </MenuItem>
                <MenuItem onClick={handleViewProfiles}>
                    <ListIcon fontSize="small" sx={{ mr: 1 }} />
                    Afficher la liste des profils
                </MenuItem>
            </Menu>

            {/* Add Profile Modal */}
            {selectedUser && (
                <AddUserProfileModal
                    open={openAddProfileModal}
                    handleClose={handleCloseAddProfileModal}
                    userId={selectedUser.userId}
                    user={selectedUser}
                />
            )}

            {/* Block User Dialog */}
            <CustomAlertDialog
                open={openBlockDialog}
                handleClose={handleCloseBlockDialog}
                title="Bloquer l'utilisateur"
                content={`Êtes-vous sûr de vouloir bloquer l'utilisateur ${selectedUser?.firstName} ${selectedUser?.lastName} ?`}
                confirmBtnText="Bloquer"
                cancelBtnText="Annuler"
                handleConfirm={handleConfirmBlock}
            />

            {/* Unblock User Dialog */}
            <CustomAlertDialog
                open={openUnblockDialog}
                handleClose={handleCloseUnblockDialog}
                title="Débloquer l'utilisateur"
                content={`Êtes-vous sûr de vouloir débloquer l'utilisateur ${selectedUser?.firstName} ${selectedUser?.lastName} ?`}
                confirmBtnText="Débloquer"
                cancelBtnText="Annuler"
                handleConfirm={handleConfirmUnblock}
            />

            {/* Send Activation Link Dialog */}
            <CustomAlertDialog
                open={openActivationDialog}
                handleClose={handleCloseActivationDialog}
                title="Envoyer un lien d'activation"
                content={`Êtes-vous sûr de vouloir envoyer un lien d'activation à ${selectedUser?.firstName} ${selectedUser?.lastName} ?`}
                confirmBtnText="Envoyer"
                cancelBtnText="Annuler"
                handleConfirm={handleConfirmActivation}
            />


            {/* Floating Alert for success/error messages */}
            <FloatingAlert
                open={alertOpen}
                feedBackMessages={alertMessage}
                severity={alertSeverity}
            />
        </>
    );
};

UsersList.propTypes = {
    searchTerm: PropTypes.string,
    structureId: PropTypes.number,
    userId: PropTypes.number,
    onEditUser: PropTypes.func,
    onViewUser: PropTypes.func,
    onViewUserProfiles: PropTypes.func
};

export default UsersList;
