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
    Select,
    MenuItem,
    Tooltip,
    Typography
} from '@mui/material';

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

// ==============================|| TYPES MANAGEMENT ||============================== //

const TypesManagement = () => {
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [privilegeTypeCode, setPrivilegeTypeCode] = useState('');
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedType, setSelectedType] = useState(null);

    // Privilege type codes for dropdown
    const privilegeTypeCodes = [
        { value: '', label: 'All' },
        { value: 'ADMIN', label: 'Admin' },
        { value: 'USER', label: 'User' },
        { value: 'GUEST', label: 'Guest' }
    ];

    useEffect(() => {
        setLoading(false);
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handlePrivilegeTypeChange = (event) => {
        setPrivilegeTypeCode(event.target.value);
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
                        <Grid item xs={12} sm={5} md={4} lg={3}>
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
                        <Grid item xs={12} sm={5} md={4} lg={3}>
                            <FormControl fullWidth>
                                <InputLabel id="privilege-type-label">Privilege Type</InputLabel>
                                <Select size={'small'}
                                    labelId="privilege-type-label"
                                    id="privilege-type-select"
                                    value={privilegeTypeCode}
                                    label="Privilege Type"
                                    onChange={handlePrivilegeTypeChange}
                                >
                                    {privilegeTypeCodes.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={2} md={4} lg={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
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
                        privilegeTypeCode={privilegeTypeCode} 
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
