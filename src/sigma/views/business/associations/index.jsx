import React, { useState } from 'react';

// material-ui
import {
    Button,
    Grid,
    InputAdornment,
    OutlinedInput,
    Tooltip,
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import AssociationsList from './AssociationsList';
import AssociationModal from './AssociationModal';

// assets
import { IconSearch } from '@tabler/icons-react';
import AddIcon from '@mui/icons-material/Add';

// ==============================|| ASSOCIATIONS MANAGEMENT ||============================== //

const AssociationsManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [openAddModal, setOpenAddModal] = useState(false);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleAddAssociation = () => {
        setOpenAddModal(true);
    };

    const handleCloseAddModal = () => {
        setOpenAddModal(false);
    };

    return (
        <MainCard title="Liste des associations">
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6} md={8}>
                            <OutlinedInput
                                id="input-search-association"
                                placeholder="Search"
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
                        <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Tooltip title="Ajouter une association">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleAddAssociation}
                                    sx={{ minWidth: '40px', p: '8px' }}
                                >
                                    <AddIcon />
                                </Button>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <AssociationsList
                        searchTerm={searchTerm}
                    />
                </Grid>
            </Grid>

            {/* Add Association Modal */}
            <AssociationModal
                open={openAddModal}
                handleClose={handleCloseAddModal}
                isEdit={false}
            />
        </MainCard>
    );
};

export default AssociationsManagement;
