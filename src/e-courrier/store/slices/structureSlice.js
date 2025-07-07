import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { structureApi } from '../../api/administrationApi';

// État initial
const initialState = {
    structures: [],
    currentStructure: null,
    rootStructures: [],
    possibleParents: [],
    changeAnchorDto: null,
    updateDto: null,
    isLoading: false,
    error: null,
    pagination: {
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
    },
    filters: {
        search: '',
        active: null,
        parentId: null,
    },
};

// Actions asynchrones
export const createStructure = createAsyncThunk(
    'structures/createStructure',
    async (structureData, { rejectWithValue }) => {
        try {
            const response = await structureApi.createStructure(structureData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de la création de la structure'
            );
        }
    }
);

export const updateStructure = createAsyncThunk(
    'structures/updateStructure',
    async (structureData, { rejectWithValue }) => {
        try {
            const response = await structureApi.updateStructure(structureData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de la mise à jour de la structure'
            );
        }
    }
);

export const searchStructures = createAsyncThunk(
    'structures/searchStructures',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await structureApi.searchStructures(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de la recherche des structures'
            );
        }
    }
);

export const getRootStructures = createAsyncThunk(
    'structures/getRootStructures',
    async (_, { rejectWithValue }) => {
        try {
            const response = await structureApi.getRootStructures();
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de la récupération des structures racines'
            );
        }
    }
);

export const getPossibleParents = createAsyncThunk(
    'structures/getPossibleParents',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await structureApi.getPossibleParents(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de la récupération des parents possibles'
            );
        }
    }
);

export const getChangeAnchorDto = createAsyncThunk(
    'structures/getChangeAnchorDto',
    async (strId, { rejectWithValue }) => {
        try {
            const response = await structureApi.getChangeAnchorDto(strId);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de la récupération du DTO de changement d\'ancrage'
            );
        }
    }
);

export const changeAnchor = createAsyncThunk(
    'structures/changeAnchor',
    async (anchorData, { rejectWithValue }) => {
        try {
            const response = await structureApi.changeAnchor(anchorData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors du changement d\'ancrage'
            );
        }
    }
);

export const getUpdateDto = createAsyncThunk(
    'structures/getUpdateDto',
    async (strId, { rejectWithValue }) => {
        try {
            const response = await structureApi.getUpdateDto(strId);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de la récupération du DTO de mise à jour'
            );
        }
    }
);

// Slice
const structureSlice = createSlice({
    name: 'structures',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        clearCurrentStructure: (state) => {
            state.currentStructure = null;
        },
        resetStructures: (state) => {
            state.structures = [];
            state.pagination = initialState.pagination;
            state.filters = initialState.filters;
        },
        setCurrentStructure: (state, action) => {
            state.currentStructure = action.payload;
        },
        clearChangeAnchorDto: (state) => {
            state.changeAnchorDto = null;
        },
        clearUpdateDto: (state) => {
            state.updateDto = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create Structure
            .addCase(createStructure.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createStructure.fulfilled, (state, action) => {
                state.isLoading = false;
                state.structures.unshift(action.payload);
                state.error = null;
            })
            .addCase(createStructure.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Update Structure
            .addCase(updateStructure.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateStructure.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.structures.findIndex(structure => structure.id === action.payload.id);
                if (index !== -1) {
                    state.structures[index] = action.payload;
                }
                if (state.currentStructure?.id === action.payload.id) {
                    state.currentStructure = action.payload;
                }
                state.error = null;
            })
            .addCase(updateStructure.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Search Structures
            .addCase(searchStructures.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(searchStructures.fulfilled, (state, action) => {
                state.isLoading = false;
                state.structures = action.payload.content || action.payload;
                state.pagination = {
                    page: action.payload.number || 0,
                    size: action.payload.size || 10,
                    totalElements: action.payload.totalElements || action.payload.length,
                    totalPages: action.payload.totalPages || 1,
                };
                state.error = null;
            })
            .addCase(searchStructures.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Get Root Structures
            .addCase(getRootStructures.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getRootStructures.fulfilled, (state, action) => {
                state.isLoading = false;
                state.rootStructures = action.payload;
                state.error = null;
            })
            .addCase(getRootStructures.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Get Possible Parents
            .addCase(getPossibleParents.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getPossibleParents.fulfilled, (state, action) => {
                state.isLoading = false;
                state.possibleParents = action.payload;
                state.error = null;
            })
            .addCase(getPossibleParents.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Get Change Anchor DTO
            .addCase(getChangeAnchorDto.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getChangeAnchorDto.fulfilled, (state, action) => {
                state.isLoading = false;
                state.changeAnchorDto = action.payload;
                state.error = null;
            })
            .addCase(getChangeAnchorDto.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Change Anchor
            .addCase(changeAnchor.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(changeAnchor.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.structures.findIndex(structure => structure.id === action.payload.id);
                if (index !== -1) {
                    state.structures[index] = action.payload;
                }
                if (state.currentStructure?.id === action.payload.id) {
                    state.currentStructure = action.payload;
                }
                state.error = null;
            })
            .addCase(changeAnchor.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Get Update DTO
            .addCase(getUpdateDto.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getUpdateDto.fulfilled, (state, action) => {
                state.isLoading = false;
                state.updateDto = action.payload;
                state.error = null;
            })
            .addCase(getUpdateDto.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearError,
    setFilters,
    setPagination,
    clearCurrentStructure,
    resetStructures,
    setCurrentStructure,
    clearChangeAnchorDto,
    clearUpdateDto
} = structureSlice.actions;

export default structureSlice.reducer;