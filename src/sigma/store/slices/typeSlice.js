import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { typeApi, typeGroupApi } from '../../api/administrationApi';

// État initial
const initialState = {
    // Types
    types: [],
    currentType: null,
    typesByGroup: [],
    directSousTypes: [],
    possibleSousTypes: [],

    // Groupes de types
    typeGroups: [],
    currentTypeGroup: null,

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
        groupCode: '',
        parentId: null,
    },
};

// =============== ACTIONS TYPES ===============
export const createType = createAsyncThunk(
    'types/createType',
    async (typeData, { rejectWithValue }) => {
        try {
            const response = await typeApi.createType(typeData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de la création du type'
            );
        }
    }
);

export const updateType = createAsyncThunk(
    'types/updateType',
    async (typeData, { rejectWithValue }) => {
        try {
            const response = await typeApi.updateType(typeData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de la mise à jour du type'
            );
        }
    }
);

export const searchTypes = createAsyncThunk(
    'types/searchTypes',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await typeApi.searchTypes(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de la recherche des types'
            );
        }
    }
);

export const getTypesByGroup = createAsyncThunk(
    'types/getTypesByGroup',
    async (groupCode, { rejectWithValue }) => {
        try {
            const response = await typeApi.getTypesByGroup(groupCode);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de la récupération des types par groupe'
            );
        }
    }
);

export const getDirectSousTypes = createAsyncThunk(
    'types/getDirectSousTypes',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await typeApi.getDirectSousTypes(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de la récupération des sous-types directs'
            );
        }
    }
);

export const getPossibleSousTypes = createAsyncThunk(
    'types/getPossibleSousTypes',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await typeApi.getPossibleSousTypes(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de la récupération des sous-types possibles'
            );
        }
    }
);

export const setSousTypes = createAsyncThunk(
    'types/setSousTypes',
    async (sousTypesData, { rejectWithValue }) => {
        try {
            const response = await typeApi.setSousTypes(sousTypesData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de la définition des sous-types'
            );
        }
    }
);

// =============== ACTIONS GROUPES DE TYPES ===============
export const createTypeGroup = createAsyncThunk(
    'types/createTypeGroup',
    async (groupData, { rejectWithValue }) => {
        try {
            const response = await typeGroupApi.createTypeGroup(groupData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de la création du groupe de types'
            );
        }
    }
);

export const updateTypeGroup = createAsyncThunk(
    'types/updateTypeGroup',
    async (groupData, { rejectWithValue }) => {
        try {
            const response = await typeGroupApi.updateTypeGroup(groupData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de la mise à jour du groupe de types'
            );
        }
    }
);

export const searchTypeGroups = createAsyncThunk(
    'types/searchTypeGroups',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await typeGroupApi.searchTypeGroups(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de la recherche des groupes de types'
            );
        }
    }
);

// Slice
const typeSlice = createSlice({
    name: 'types',
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
        clearCurrentType: (state) => {
            state.currentType = null;
        },
        clearCurrentTypeGroup: (state) => {
            state.currentTypeGroup = null;
        },
        resetTypes: (state) => {
            state.types = [];
            state.typesByGroup = [];
            state.directSousTypes = [];
            state.possibleSousTypes = [];
            state.pagination = initialState.pagination;
            state.filters = initialState.filters;
        },
        resetTypeGroups: (state) => {
            state.typeGroups = [];
        },
        setCurrentType: (state, action) => {
            state.currentType = action.payload;
        },
        setCurrentTypeGroup: (state, action) => {
            state.currentTypeGroup = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // =============== TYPES ===============
            // Create Type
            .addCase(createType.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createType.fulfilled, (state, action) => {
                state.isLoading = false;
                state.types.unshift(action.payload);
                state.error = null;
            })
            .addCase(createType.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Update Type
            .addCase(updateType.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateType.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.types.findIndex(type => type.id === action.payload.id);
                if (index !== -1) {
                    state.types[index] = action.payload;
                }
                if (state.currentType?.id === action.payload.id) {
                    state.currentType = action.payload;
                }
                state.error = null;
            })
            .addCase(updateType.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Search Types
            .addCase(searchTypes.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(searchTypes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.types = action.payload.content || action.payload;
                state.pagination = {
                    page: action.payload.number || 0,
                    size: action.payload.size || 10,
                    totalElements: action.payload.totalElements || action.payload.length,
                    totalPages: action.payload.totalPages || 1,
                };
                state.error = null;
            })
            .addCase(searchTypes.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Get Types By Group
            .addCase(getTypesByGroup.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getTypesByGroup.fulfilled, (state, action) => {
                state.isLoading = false;
                state.typesByGroup = action.payload;
                state.error = null;
            })
            .addCase(getTypesByGroup.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Get Direct Sous Types
            .addCase(getDirectSousTypes.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getDirectSousTypes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.directSousTypes = action.payload;
                state.error = null;
            })
            .addCase(getDirectSousTypes.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Get Possible Sous Types
            .addCase(getPossibleSousTypes.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getPossibleSousTypes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.possibleSousTypes = action.payload;
                state.error = null;
            })
            .addCase(getPossibleSousTypes.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Set Sous Types
            .addCase(setSousTypes.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(setSousTypes.fulfilled, (state, action) => {
                state.isLoading = false;
                // Mettre à jour le type parent avec ses nouveaux sous-types
                const index = state.types.findIndex(type => type.id === action.payload.id);
                if (index !== -1) {
                    state.types[index] = action.payload;
                }
                if (state.currentType?.id === action.payload.id) {
                    state.currentType = action.payload;
                }
                state.error = null;
            })
            .addCase(setSousTypes.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // =============== GROUPES DE TYPES ===============
            // Create Type Group
            .addCase(createTypeGroup.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createTypeGroup.fulfilled, (state, action) => {
                state.isLoading = false;
                state.typeGroups.unshift(action.payload);
                state.error = null;
            })
            .addCase(createTypeGroup.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Update Type Group
            .addCase(updateTypeGroup.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateTypeGroup.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.typeGroups.findIndex(group => group.id === action.payload.id);
                if (index !== -1) {
                    state.typeGroups[index] = action.payload;
                }
                if (state.currentTypeGroup?.id === action.payload.id) {
                    state.currentTypeGroup = action.payload;
                }
                state.error = null;
            })
            .addCase(updateTypeGroup.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Search Type Groups
            .addCase(searchTypeGroups.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(searchTypeGroups.fulfilled, (state, action) => {
                state.isLoading = false;
                state.typeGroups = action.payload.content || action.payload;
                state.error = null;
            })
            .addCase(searchTypeGroups.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearError,
    setFilters,
    setPagination,
    clearCurrentType,
    clearCurrentTypeGroup,
    resetTypes,
    resetTypeGroups,
    setCurrentType,
    setCurrentTypeGroup
} = typeSlice.actions;

export default typeSlice.reducer;