import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

// État initial
const initialState = {
    user: null,
    token: localStorage.getItem('e-courrier-access-token'),
    refreshToken: localStorage.getItem('e-courrier-refresh-token'),
    isAuthenticated: !!localStorage.getItem('e-courrier-access-token'),
    isLoading: false,
    error: null
};

// Actions asynchrones
export const login = createAsyncThunk('auth/login', async ({ username, password }, { rejectWithValue }) => {
    try {
        const response = await apiClient.post('/users/open/login', {
            username,
            password
        });

        const { token, refreshToken, user } = response.data;

        // Sauvegarder les tokens
        localStorage.setItem('e-courrier-access-token', token);
        localStorage.setItem('e-courrier-refresh-token', refreshToken);

        return { token, refreshToken, user };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Erreur de connexion');
    }
});

export const logout = createAsyncThunk('auth/logout', async () => {
    try {
        await apiClient.post('/users/open/logout');
    } catch (error) {
        // Même en cas d'erreur, on déconnecte localement
        console.warn('Erreur lors de la déconnexion:', error);
    } finally {
        // Nettoyer le localStorage
        localStorage.removeItem('e-courrier-access-token');
        localStorage.removeItem('e-courrier-refresh-token');
    }
});

export const refreshToken = createAsyncThunk('auth/refreshToken', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();

        // Vérifier si l'utilisateur est connecté
        if (!auth.user || !auth.user.id) {
            return rejectWithValue('Utilisateur non connecté');
        }

        // Utiliser le nouvel endpoint avec l'ID de l'utilisateur et placer le refreshToken dans l'entête
        const response = await apiClient.post(`/users/refresh-token/${auth.user.id}`, {}, {
            headers: {
                'RefreshToken': auth.refreshToken
            }
        });

        const { token, refreshToken: newRefreshToken } = response.data;

        // Mettre à jour les tokens
        localStorage.setItem('e-courrier-access-token', token);
        localStorage.setItem('e-courrier-refresh-token', newRefreshToken);

        return { token, refreshToken: newRefreshToken };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Erreur de rafraîchissement');
    }
});

// Slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.refreshToken = action.payload.refreshToken;
                state.user = action.payload.user;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.token = null;
                state.refreshToken = null;
                state.user = null;
                state.error = action.payload;
            })
            // Logout
            .addCase(logout.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.token = null;
                state.refreshToken = null;
                state.user = null;
                state.error = null;
            })
            // Refresh Token
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.token = action.payload.token;
                state.refreshToken = action.payload.refreshToken;
            })
            .addCase(refreshToken.rejected, (state) => {
                state.isAuthenticated = false;
                state.token = null;
                state.refreshToken = null;
                state.user = null;
            });
    }
});

export const { clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;
