import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Stack, Pagination as MuiPagination, Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';

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
    sx = { mt: 2 },
    // Support for alternative prop names used in some components
    page,
    count,
    rowsPerPage,
    onRowsPerPageChange,
    totalCount
}) => {
    // Handle prop name differences
    const effectivePage = page !== undefined ? page : currentPage;
    const effectiveTotalPages = count !== undefined ? count : totalPages;
    const effectivePageSize = rowsPerPage !== undefined ? rowsPerPage : currentSize;
    const effectiveOnSizeChange = onRowsPerPageChange || onSizeChange;
    // Handle page change
    const handlePageChange = (event, newPage) => {
        // Convert from 1-based to 0-based indexing for API
        onPageChange(newPage - 1);
    };

    // Handle page size change
    const handleSizeChange = (event) => {
        if (effectiveOnSizeChange) {
            effectiveOnSizeChange(event.target.value);
        }
    };

    // Page size options
    const sizeOptions = [5, 10, 15, 20, 25, 30];

    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={sx}>
            {/* Display total count if available */}
            {totalCount !== undefined ? (
                <Typography variant="body2" color="textSecondary">
                    Total: {totalCount} élément{totalCount !== 1 ? 's' : ''}
                </Typography>
            ) : (
                <div /> /* Empty div for spacing if no totalCount */
            )}
            <MuiPagination 
                count={effectiveTotalPages} 
                page={(effectivePage || 0) + 1} // Convert from 0-based to 1-based for UI
                onChange={handlePageChange} 
                color={color} 
                showFirstButton={showFirstButton} 
                showLastButton={showLastButton} 
            />
            <FormControl variant="outlined" size="small" sx={{ minWidth: 80 }}>
                <Select
                    value={effectivePageSize}
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
    // Original props
    totalPages: PropTypes.number,
    currentPage: PropTypes.number,
    onPageChange: PropTypes.func.isRequired,
    currentSize: PropTypes.number,
    onSizeChange: PropTypes.func,
    color: PropTypes.string,
    showFirstButton: PropTypes.bool,
    showLastButton: PropTypes.bool,
    sx: PropTypes.object,
    // Alternative prop names
    page: PropTypes.number,
    count: PropTypes.number,
    rowsPerPage: PropTypes.number,
    onRowsPerPageChange: PropTypes.func,
    totalCount: PropTypes.number
};

export default Pagination;
