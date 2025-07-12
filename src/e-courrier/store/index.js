import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

// Import des slices
import authSlice from './slices/authSlice';
import userSlice from './slices/userSlice';
import authoritySlice from './slices/authoritySlice';
import structureSlice from './slices/structureSlice';
import typeSlice from './slices/typeSlice';

// Configuration de la persistance
const persistConfig = {
    key: 'e-courrier-root',
    storage,
    whitelist: ['auth'], // Seul le slice auth sera persisté
};

// Combinaison des reducers
const rootReducer = combineReducers({
    auth: authSlice,
    users: userSlice,
    authorities: authoritySlice,
    structures: structureSlice,
    types: typeSlice
});

// Reducer persisté
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configuration du store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
    devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);