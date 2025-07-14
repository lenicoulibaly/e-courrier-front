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
    TextField
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import TypesList from './TypesList';
import AddTypeModal from './AddTypeModal';
import EditTypeModal from './EditTypeModal';

// assets
import { IconSearch } from '@tabler/icons-react';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import { useGetAllTypeGroups} from '../../../hooks/query';

// ==============================|| TYPES MANAGEMENT ||============================== //

const TypesManagement = () => {
    const navigate = useNavigate();
    const [, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedType, setSelectedType] = useState(null);

    const {data: groups} = useGetAllTypeGroups()

        useEffect(() => {
        setLoading(false);
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleGroupsChange = (event, newValue) => {
        // newValue will be an array of selected group objects
        setSelectedGroups(newValue.map(group => group.groupCode));
    };


    const handleAddType = () => {
        setOpenAddModal(true);
    };

    const handleEditType = (type) => {
        setSelectedType(type);
        setOpenEditModal(true);
    };

    const handleCloseAddModal = () => {
        setOpenAddModal(false);
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setSelectedType(null);
    };

    const theme = useTheme();

    return (
        <MainCard title="Types Management">
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={5} md={4}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="search-types">Search</InputLabel>
                                <OutlinedInput size={'small'}
                                    id="search-types"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    placeholder="Search types..."
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <IconSearch stroke={1.5} size="1rem" />
                                        </InputAdornment>
                                    }
                                    label="Search"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={5} md={6}>
                            <FormControl fullWidth>
                                <Autocomplete
                                    multiple
                                    size={'small'}
                                    id="groups-select"
                                    options={groups || []}
                                    getOptionLabel={(option) => option.name}
                                    isOptionEqualToValue={(option, value) => option.groupCode === value.groupCode}
                                    value={(groups || []).filter(group => selectedGroups.includes(group.groupCode))}
                                    onChange={handleGroupsChange}
                                    filterSelectedOptions
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Groupes"
                                            placeholder="Filtrer les groupes"
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Tooltip title="Ajout d'un nouveau type" placement="top" arrow>
                                <Button
                                    variant="contained"
                                    onClick={handleAddType}
                                    sx={{ minWidth: '40px', width: '40px', height: '40px', padding: 0, backgroundColor:theme.palette.secondary.main }}
                                >
                                    <AddIcon />
                                </Button>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <TypesList 
                        searchTerm={searchTerm} 
                        groupCodes={selectedGroups}
                        onEditType={handleEditType} 
                    />
                </Grid>
            </Grid>

            {/* Add Type Modal */}
            <AddTypeModal open={openAddModal} handleClose={handleCloseAddModal} />

            {/* Edit Type Modal */}
            {selectedType && (
                <EditTypeModal 
                    open={openEditModal} 
                    handleClose={handleCloseEditModal} 
                    type={selectedType} 
                />
            )}
        </MainCard>
    );
};

export default TypesManagement;
