import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { privilegeApi, roleApi, profileApi, authorityApi } from '../../api/administrationApi';

// État initial
const initialState = {
    // Privilèges
    privileges: [],
    currentPrivilege: null,

    // Rôles
    roles: [],
    currentRole: null,

    // Profils
    profiles: [],
    currentProfile: null,

    // Autorités utilisateur
    userAuthorities: null,

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
        profileCode: '',
        roleCode: '',
        userId: null,
    },
};

// =============== ACTIONS PRIVILÈGES ===============
export const createPrivilege = createAsyncThunk(
    'authorities/createPrivilege',
    async (privilegeData, { rejectWithValue }) => {
        try {
            const response = await privilegeApi.createPrivilege(privilegeData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de la création du privilège'
            );
        }
    }
);

export const createPrivileges = createAsyncThunk(
    'authorities/createPrivileges',
    async (privilegesData, { rejectWithValue }) => {
        try {
            const response = await privilegeApi.createPrivileges(privilegesData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de la création des privilèges'
            );
        }
    }
);

export const updatePrivilege = createAsyncThunk(
    'authorities/updatePrivilege',
    async (privilegeData, { rejectWithValue }) => {
        try {
            const response = await privilegeApi.updatePrivilege(privilegeData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de la mise à jour du privilège'
            );
        }
    }
);

export const searchPrivileges = createAsyncThunk(
    'authorities/searchPrivileges',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await privilegeApi.searchPrivileges(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de la recherche des privilèges'
            );
        }
    }
);

export const searchPrivilegesByProfile = createAsyncThunk(
    'authorities/searchPrivilegesByProfile',
    async ({ profileCode, params = {} }, { rejectWithValue }) => {
        try {
            const response = await privilegeApi.searchPrivilegesByProfile(profileCode, params);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de la recherche des privilèges par profil'
            );
        }
    }
);

export const searchPrivilegesByRole = createAsyncThunk(
    'authorities/searchPrivilegesByRole',
    async ({ roleCode, params = {} }, { rejectWithValue }) => {
        try {
            const response = await privilegeApi.searchPrivilegesByRole(roleCode, params);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de la recherche des privilèges par rôle'
            );
        }
    }
);

// =============== ACTIONS RÔLES ===============
export const createRole = createAsyncThunk(
    'authorities/createRole',
    async (roleData, { rejectWithValue }) => {
        try {
            const response = await roleApi.createRole(roleData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de la création du rôle'
            );
        }
    }
);

export const updateRole = createAsyncThunk(
    'authorities/updateRole',
    async (roleData, { rejectWithValue }) => {
        try {
            const response = await roleApi.updateRole(roleData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de la mise à jour du rôle'
            );
        }
    }
);

export const searchRoles = createAsyncThunk(
    'authorities/searchRoles',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await roleApi.searchRoles(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de la recherche des rôles'
            );
        }
    }
);

export const searchRolesByProfile = createAsyncThunk(
    'authorities/searchRolesByProfile',
    async ({ profileCode, params = {} }, { rejectWithValue }) => {
        try {
            const response = await roleApi.searchRolesByProfile(profileCode, params);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de la recherche des rôles par profil'
            );
        }
    }
);

// =============== ACTIONS PROFILS ===============
export const createProfile = createAsyncThunk(
    'authorities/createProfile',
    async (profileData, { rejectWithValue }) => {
        try {
            const response = await profileApi.createProfile(profileData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de la création du profil'
            );
        }
    }
);

export const updateProfile = createAsyncThunk(
    'authorities/updateProfile',
    async (profileData, { rejectWithValue }) => {
        try {
            const response = await profileApi.updateProfile(profileData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de la mise à jour du profil'
            );
        }
    }
);

export const searchProfiles = createAsyncThunk(
    'authorities/searchProfiles',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await profileApi.searchProfiles(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de la recherche des profils'
            );
        }
    }
);

export const searchProfilesByUser = createAsyncThunk(
    'authorities/searchProfilesByUser',
    async ({ userId, params = {} }, { rejectWithValue }) => {
        try {
            const response = await profileApi.searchProfilesByUser(userId, params);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de la recherche des profils par utilisateur'
            );
        }
    }
);

export const addProfileToUser = createAsyncThunk(
    'authorities/addProfileToUser',
    async (profileUserData, { rejectWithValue }) => {
        try {
            const response = await profileApi.addProfileToUser(profileUserData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de l\'ajout du profil à l\'utilisateur'
            );
        }
    }
);

// =============== ACTIONS AUTORITÉS ===============
export const getUserAuthorities = createAsyncThunk(
    'authorities/getUserAuthorities',
    async (username, { rejectWithValue }) => {
        try {
            const response = await authorityApi.getUserAuthorities(username);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de la récupération des autorités utilisateur'
            );
        }
    }
);

// Slice
const authoritySlice = createSlice({
    name: 'authorities',
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
        clearCurrentPrivilege: (state) => {
            state.currentPrivilege = null;
        },
        clearCurrentRole: (state) => {
            state.currentRole = null;
        },
        clearCurrentProfile: (state) => {
            state.currentProfile = null;
        },
        resetAuthorities: (state) => {
            state.privileges = [];
            state.roles = [];
            state.profiles = [];
            state.userAuthorities = null;
            state.pagination = initialState.pagination;
            state.filters = initialState.filters;
        },
        setCurrentPrivilege: (state, action) => {
            state.currentPrivilege = action.payload;
        },
        setCurrentRole: (state, action) => {
            state.currentRole = action.payload;
        },
        setCurrentProfile: (state, action) => {
            state.currentProfile = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // =============== PRIVILÈGES ===============
            // Create Privilege
            .addCase(createPrivilege.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createPrivilege.fulfilled, (state, action) => {
                state.isLoading = false;
                state.privileges.unshift(action.payload);
                state.error = null;
            })
            .addCase(createPrivilege.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Create Privileges
            .addCase(createPrivileges.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createPrivileges.fulfilled, (state, action) => {
                state.isLoading = false;
                state.privileges = [...action.payload, ...state.privileges];
                state.error = null;
            })
            .addCase(createPrivileges.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Update Privilege
            .addCase(updatePrivilege.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updatePrivilege.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.privileges.findIndex(privilege => privilege.id === action.payload.id);
                if (index !== -1) {
                    state.privileges[index] = action.payload;
                }
                if (state.currentPrivilege?.id === action.payload.id) {
                    state.currentPrivilege = action.payload;
                }
                state.error = null;
            })
            .addCase(updatePrivilege.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Search Privileges
            .addCase(searchPrivileges.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(searchPrivileges.fulfilled, (state, action) => {
                state.isLoading = false;
                state.privileges = action.payload.content || action.payload;
                state.pagination = {
                    page: action.payload.number || 0,
                    size: action.payload.size || 10,
                    totalElements: action.payload.totalElements || action.payload.length,
                    totalPages: action.payload.totalPages || 1,
                };
                state.error = null;
            })
            .addCase(searchPrivileges.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Search Privileges By Profile
            .addCase(searchPrivilegesByProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.privileges = action.payload.content || action.payload;
                state.error = null;
            })
            // Search Privileges By Role
            .addCase(searchPrivilegesByRole.fulfilled, (state, action) => {
                state.isLoading = false;
                state.privileges = action.payload.content || action.payload;
                state.error = null;
            })

            // =============== RÔLES ===============
            // Create Role
            .addCase(createRole.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createRole.fulfilled, (state, action) => {
                state.isLoading = false;
                state.roles.unshift(action.payload);
                state.error = null;
            })
            .addCase(createRole.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Update Role
            .addCase(updateRole.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateRole.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.roles.findIndex(role => role.id === action.payload.id);
                if (index !== -1) {
                    state.roles[index] = action.payload;
                }
                if (state.currentRole?.id === action.payload.id) {
                    state.currentRole = action.payload;
                }
                state.error = null;
            })
            .addCase(updateRole.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Search Roles
            .addCase(searchRoles.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(searchRoles.fulfilled, (state, action) => {
                state.isLoading = false;
                state.roles = action.payload.content || action.payload;
                state.error = null;
            })
            .addCase(searchRoles.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Search Roles By Profile
            .addCase(searchRolesByProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.roles = action.payload.content || action.payload;
                state.error = null;
            })

            // =============== PROFILS ===============
            // Create Profile
            .addCase(createProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profiles.unshift(action.payload);
                state.error = null;
            })
            .addCase(createProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Update Profile
            .addCase(updateProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.profiles.findIndex(profile => profile.id === action.payload.id);
                if (index !== -1) {
                    state.profiles[index] = action.payload;
                }
                if (state.currentProfile?.id === action.payload.id) {
                    state.currentProfile = action.payload;
                }
                state.error = null;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Search Profiles
            .addCase(searchProfiles.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(searchProfiles.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profiles = action.payload.content || action.payload;
                state.error = null;
            })
            .addCase(searchProfiles.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Search Profiles By User
            .addCase(searchProfilesByUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profiles = action.payload.content || action.payload;
                state.error = null;
            })
            // Add Profile To User
            .addCase(addProfileToUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addProfileToUser.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(addProfileToUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // =============== AUTORITÉS UTILISATEUR ===============
            // Get User Authorities
            .addCase(getUserAuthorities.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getUserAuthorities.fulfilled, (state, action) => {
                state.isLoading = false;
                state.userAuthorities = action.payload;
                state.error = null;
            })
            .addCase(getUserAuthorities.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearError,
    setFilters,
    setPagination,
    clearCurrentPrivilege,
    clearCurrentRole,
    clearCurrentProfile,
    resetAuthorities,
    setCurrentPrivilege,
    setCurrentRole,
    setCurrentProfile
} = authoritySlice.actions;

export default authoritySlice.reducer;