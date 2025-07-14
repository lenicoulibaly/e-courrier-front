import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import {
    Box,
    Button,
    FormControl,
    Grid,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    MenuItem,
    Tooltip,
    Typography,
    TextField,
    Chip
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import PrivilegesList from './PrivilegesList';
import AddPrivilegeModal from './AddPrivilegeModal';
import EditPrivilegeModal from './EditPrivilegeModal';
import { useTypesByGroupCode } from '../../../hooks/query';

// assets
import { IconSearch } from '@tabler/icons-react';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';

// ==============================|| PRIVILEGES MANAGEMENT ||============================== //

const PrivilegesManagement = () => {
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPrivilegeTypes, setSelectedPrivilegeTypes] = useState([]);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedPrivilege, setSelectedPrivilege] = useState(null);

    // Fetch privilege types
    const { data: privilegeTypes, isLoading: isLoadingTypes } = useTypesByGroupCode('PRV');

    useEffect(() => {
        setLoading(false);
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleAddPrivilege = () => {
        setOpenAddModal(true);
    };

    const handleEditPrivilege = (privilege) => {
        setSelectedPrivilege(privilege);
        setOpenEditModal(true);
    };

    const handleCloseAddModal = () => {
        setOpenAddModal(false);
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setSelectedPrivilege(null);
    };

    const theme = useTheme();

    return (
        <MainCard title="Gestion des privilèges">
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4} md={4}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="search-privileges">Recherche</InputLabel>
                                <OutlinedInput size={'small'}
                                    id="search-privileges"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    placeholder="Rechercher des privilèges..."
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <IconSearch stroke={1.5} size="1rem" />
                                        </InputAdornment>
                                    }
                                    label="Recherche"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <Autocomplete
                                multiple
                                id="privilege-types-filter"
                                options={privilegeTypes || []}
                                getOptionLabel={(option) => option.name}
                                value={selectedPrivilegeTypes}
                                onChange={(event, newValue) => setSelectedPrivilegeTypes(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        size="small"
                                        label="Types de privilège"
                                        placeholder="Filtrer par type"
                                    />
                                )}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip
                                            label={option.name}
                                            size="small"
                                            {...getTagProps({ index })}
                                        />
                                    ))
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Tooltip title="Ajout d'un nouveau privilège" placement="top" arrow>
                                <Button
                                    variant="contained"
                                    onClick={handleAddPrivilege}
                                    sx={{ minWidth: '40px', width: '40px', height: '40px', padding: 0, backgroundColor:theme.palette.secondary.main }}
                                >
                                    <AddIcon />
                                </Button>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <PrivilegesList 
                        searchTerm={searchTerm}
                        privilegeTypeCodes={selectedPrivilegeTypes.map(type => type.code)}
                        onEditPrivilege={handleEditPrivilege} 
                    />
                </Grid>
            </Grid>

            {/* Add Privilege Modal */}
            <AddPrivilegeModal open={openAddModal} handleClose={handleCloseAddModal} />

            {/* Edit Privilege Modal */}
            {selectedPrivilege && (
                <EditPrivilegeModal 
                    open={openEditModal} 
                    handleClose={handleCloseEditModal} 
                    privilege={selectedPrivilege} 
                />
            )}
        </MainCard>
    );
};

export default PrivilegesManagement;
