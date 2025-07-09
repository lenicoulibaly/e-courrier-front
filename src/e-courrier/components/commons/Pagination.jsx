import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Stack, Pagination as MuiPagination, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

// ==============================|| PAGINATION COMPONENT ||============================== //

const Pagination = ({ 
    totalPages, 
    currentPage, 
    onPageChange, 
    currentSize = 3,
    onSizeChange,
    color = 'primary', 
    showFirstButton = true, 
    showLastButton = true,
    sx = { mt: 2 } 
}) => {
    // Handle page change
    const handlePageChange = (event, newPage) => {
        // Convert from 1-based to 0-based indexing for API
        onPageChange(newPage - 1);
    };

    // Handle page size change
    const handleSizeChange = (event) => {
        if (onSizeChange) {
            onSizeChange(event.target.value);
        }
    };

    // Page size options
    const sizeOptions = [5, 10, 15, 20, 25, 30];

    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={sx}>
            <div /> {/* Empty div for spacing */}
            <MuiPagination 
                count={totalPages} 
                page={currentPage + 1} // Convert from 0-based to 1-based for UI
                onChange={handlePageChange} 
                color={color} 
                showFirstButton={showFirstButton} 
                showLastButton={showLastButton} 
            />
            <FormControl variant="outlined" size="small" sx={{ minWidth: 80 }}>
                <Select
                    value={currentSize}
                    onChange={handleSizeChange}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Page size' }}
                >
                    {sizeOptions.map((size) => (
                        <MenuItem key={size} value={size}>
                            {size}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Stack>
    );
};

Pagination.propTypes = {
    totalPages: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    currentSize: PropTypes.number,
    onSizeChange: PropTypes.func,
    color: PropTypes.string,
    showFirstButton: PropTypes.bool,
    showLastButton: PropTypes.bool,
    sx: PropTypes.object
};

export default Pagination;
