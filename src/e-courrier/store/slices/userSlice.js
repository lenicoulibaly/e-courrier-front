
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userApi } from '../../api/administrationApi';

// État initial
const initialState = {
    users: [],
    currentUser: null,
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
        role: '',
    },
};

// Actions asynchrones
export const searchUsers = createAsyncThunk(
    'users/searchUsers',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await userApi.searchUsers(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de la recherche des utilisateurs'
            );
        }
    }
);

export const createUser = createAsyncThunk(
    'users/createUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await userApi.createUser(userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de la création de l\'utilisateur'
            );
        }
    }
);

export const updateUser = createAsyncThunk(
    'users/updateUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await userApi.updateUser(userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de la mise à jour de l\'utilisateur'
            );
        }
    }
);

export const activateUser = createAsyncThunk(
    'users/activateUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await userApi.activateUser(userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de l\'activation de l\'utilisateur'
            );
        }
    }
);

export const blockUser = createAsyncThunk(
    'users/blockUser',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await userApi.blockUser(userId);
            return { userId, ...response.data };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors du blocage de l\'utilisateur'
            );
        }
    }
);

export const unblockUser = createAsyncThunk(
    'users/unblockUser',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await userApi.unblockUser(userId);
            return { userId, ...response.data };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors du déblocage de l\'utilisateur'
            );
        }
    }
);

export const changePassword = createAsyncThunk(
    'users/changePassword',
    async (passwordData, { rejectWithValue }) => {
        try {
            const response = await userApi.changePassword(passwordData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors du changement de mot de passe'
            );
        }
    }
);

export const resetPassword = createAsyncThunk(
    'users/resetPassword',
    async (resetData, { rejectWithValue }) => {
        try {
            const response = await userApi.resetPassword(resetData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de la réinitialisation du mot de passe'
            );
        }
    }
);

export const sendActivationEmail = createAsyncThunk(
    'users/sendActivationEmail',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await userApi.sendActivationEmail(userId);
            return { userId, ...response.data };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de l\'envoi de l\'email d\'activation'
            );
        }
    }
);

export const sendResetPasswordEmail = createAsyncThunk(
    'users/sendResetPasswordEmail',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await userApi.sendResetPasswordEmail(userId);
            return { userId, ...response.data };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Erreur lors de l\'envoi de l\'email de réinitialisation'
            );
        }
    }
);

// Slice
const userSlice = createSlice({
    name: 'users',
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
        clearCurrentUser: (state) => {
            state.currentUser = null;
        },
        resetUsers: (state) => {
            state.users = [];
            state.pagination = initialState.pagination;
            state.filters = initialState.filters;
        },
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Search Users
            .addCase(searchUsers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(searchUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload.content || action.payload;
                state.pagination = {
                    page: action.payload.number || 0,
                    size: action.payload.size || 10,
                    totalElements: action.payload.totalElements || action.payload.length,
                    totalPages: action.payload.totalPages || 1,
                };
                state.error = null;
            })
            .addCase(searchUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Create User
            .addCase(createUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users.unshift(action.payload);
                state.error = null;
            })
            .addCase(createUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Update User
            .addCase(updateUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.users.findIndex(user => user.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
                if (state.currentUser?.id === action.payload.id) {
                    state.currentUser = action.payload;
                }
                state.error = null;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Activate User
            .addCase(activateUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(activateUser.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.users.findIndex(user => user.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
                if (state.currentUser?.id === action.payload.id) {
                    state.currentUser = action.payload;
                }
                state.error = null;
            })
            .addCase(activateUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Block User
            .addCase(blockUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(blockUser.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.users.findIndex(user => user.id === action.payload.userId);
                if (index !== -1) {
                    state.users[index] = { ...state.users[index], blocked: true };
                }
                if (state.currentUser?.id === action.payload.userId) {
                    state.currentUser = { ...state.currentUser, blocked: true };
                }
                state.error = null;
            })
            .addCase(blockUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Unblock User
            .addCase(unblockUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(unblockUser.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.users.findIndex(user => user.id === action.payload.userId);
                if (index !== -1) {
                    state.users[index] = { ...state.users[index], blocked: false };
                }
                if (state.currentUser?.id === action.payload.userId) {
                    state.currentUser = { ...state.currentUser, blocked: false };
                }
                state.error = null;
            })
            .addCase(unblockUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Change Password
            .addCase(changePassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Reset Password
            .addCase(resetPassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Send Activation Email
            .addCase(sendActivationEmail.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(sendActivationEmail.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(sendActivationEmail.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Send Reset Password Email
            .addCase(sendResetPasswordEmail.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(sendResetPasswordEmail.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(sendResetPasswordEmail.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearError,
    setFilters,
    setPagination,
    clearCurrentUser,
    resetUsers,
    setCurrentUser
} = userSlice.actions;

export default userSlice.reducer;