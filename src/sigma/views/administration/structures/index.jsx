import React, { useState } from 'react';

// material-ui
import {
    Autocomplete,
    Button,
    Grid,
    InputAdornment,
    OutlinedInput,
    TextField,
    Tooltip,
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import StructuresList from './StructuresList';
import AddStructureModal from './AddStructureModal';
import EditStructureModal from './EditStructureModal';
import ChangeAnchorModal from './ChangeAnchorModal';
import { useTypesByGroupCode } from '../../../hooks/query/useTypes';

// assets
import { IconSearch } from '@tabler/icons-react';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';

// ==============================|| STRUCTURES MANAGEMENT ||============================== //

const StructuresManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState(null);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openChangeAnchorModal, setOpenChangeAnchorModal] = useState(false);
    const [selectedStructure, setSelectedStructure] = useState(null);
    const theme = useTheme();

    // Fetch structure types for the filter
    const { data: structureTypes, isLoading: isLoadingTypes } = useTypesByGroupCode("STR");

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleTypeChange = (event, newValue) => {
        setSelectedType(newValue);
    };

    const handleAddStructure = () => {
        setOpenAddModal(true);
    };

    const handleEditStructure = (structure) => {
        setSelectedStructure(structure);
        setOpenEditModal(true);
    };

    const handleChangeAnchor = (structure) => {
        setSelectedStructure(structure);
        setOpenChangeAnchorModal(true);
    };

    const handleCloseAddModal = () => {
        setOpenAddModal(false);
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setSelectedStructure(null);
    };

    const handleCloseChangeAnchorModal = () => {
        setOpenChangeAnchorModal(false);
        setSelectedStructure(null);
    };

    return (
        <MainCard title="Gestion des structures">
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6} md={4}>
                            <OutlinedInput
                                id="input-search-structure"
                                placeholder="Rechercher..."
                                fullWidth
                                size="small"
                                value={searchTerm}
                                onChange={handleSearch}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <IconSearch stroke={1.5} size="1rem" />
                                    </InputAdornment>
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Autocomplete
                                id="type-filter"
                                options={structureTypes || []}
                                getOptionLabel={(option) => option.name}
                                value={selectedType}
                                onChange={handleTypeChange}
                                size="small"
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Type de structure"
                                        variant="outlined"
                                        placeholder="Tous les types"
                                        size="small"
                                    />
                                )}
                                loading={isLoadingTypes}
                                loadingText="Chargement..."
                                noOptionsText="Aucun type trouvé"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Tooltip title="Ajouter une structure">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleAddStructure}
                                    sx={{ minWidth: '40px', p: '8px' }}
                                >
                                    <AddIcon />
                                </Button>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <StructuresList
                        searchTerm={searchTerm}
                        typeCode={selectedType?.code}
                        onEditStructure={handleEditStructure}
                        onChangeAnchor={handleChangeAnchor}
                    />
                </Grid>
            </Grid>

            {/* Add Structure Modal */}
            {openAddModal && (
                <AddStructureModal
                    open={openAddModal}
                    handleClose={handleCloseAddModal}
                />
            )}

            {/* Edit Structure Modal */}
            {openEditModal && selectedStructure && (
                <EditStructureModal
                    open={openEditModal}
                    handleClose={handleCloseEditModal}
                    structure={selectedStructure}
                />
            )}

            {/* Change Anchor Modal */}
            {openChangeAnchorModal && selectedStructure && (
                <ChangeAnchorModal
                    open={openChangeAnchorModal}
                    handleClose={handleCloseChangeAnchorModal}
                    structure={selectedStructure}
                />
            )}
        </MainCard>
    );
};

export default StructuresManagement;
