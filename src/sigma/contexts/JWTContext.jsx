import PropTypes from 'prop-types';
import React, { createContext, useEffect, useReducer } from 'react';

// third-party
import { Chance } from 'chance';
import { jwtDecode } from 'jwt-decode';

// reducer - state management
import { LOGIN, LOGOUT } from 'store/actions';
import accountReducer from 'store/accountReducer';

// project imports
import Loader from 'ui-component/Loader';
import apiClient from '../api/apiClient';
import { getUserFromAccessToken } from '../utilities/jwtParser';

const chance = new Chance();

// constant
const initialState = {
    isLoggedIn: false,
    isInitialized: false,
    user: null
};

const verifyToken = (serviceToken) => {
    if (!serviceToken) {
        return false;
    }
    const decoded = jwtDecode(serviceToken);
    /**
     * Property 'exp' does not exist on type '<T = unknown>(token, options) => T'.
     */
    return decoded.exp > Date.now() / 1000;
};

const setSession = (authResponse) => {
    if (authResponse) {
        localStorage.setItem('sigma-access-token', authResponse.accessToken);
        localStorage.setItem('sigma-refresh-token', authResponse.refreshToken);
        apiClient.defaults.headers.common.Authorization = `Bearer ${authResponse.accessToken}`;
    } else {
        localStorage.removeItem('sigma-access-token');
        localStorage.removeItem('sigma-refresh-token');
        delete apiClient.defaults.headers.common.Authorization;
    }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //
const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
    const [state, dispatch] = useReducer(accountReducer, initialState);

    useEffect(() => {
        const init = async () => {
            try {
                const serviceToken = window.localStorage.getItem('sigma-access-token');
                if (serviceToken && verifyToken(serviceToken)) {
                    const user  = getUserFromAccessToken(serviceToken);
                    dispatch({
                        type: LOGIN,
                        payload: {
                            isLoggedIn: true,
                            user
                        }
                    });
                } else {
                    dispatch({
                        type: LOGOUT
                    });
                }
            } catch (err) {
                console.error(err);
                dispatch({
                    type: LOGOUT
                });
            }
        };

        init();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await apiClient.post('/users/open/login', { email, password });

            const authResponse = response?.data;
            const accessToken = authResponse?.accessToken;

            const user = getUserFromAccessToken(accessToken);

            if (!authResponse) {
                console.error('No token found in response:', response.data);
                throw new Error('Erreur de connexion: Aucun token reçu du serveur.');
            }

            setSession(authResponse);
            dispatch({
                type: LOGIN,
                payload: {
                    isLoggedIn: true,
                    user
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            throw new Error(error.response?.data || 'Erreur de connexion. Veuillez vérifier vos identifiants.');
        }
    };

    const register = async (email, password, firstName, lastName) => {
        // todo: this flow need to be recode as it not verified
        const id = chance.bb_pin();
        const response = await apiClient.post('/users/open/register', {
            id,
            email,
            password,
            firstName,
            lastName
        });
        let users = response.data;

        if (window.localStorage.getItem('users') !== undefined && window.localStorage.getItem('users') !== null) {
            const localUsers = window.localStorage.getItem('users');
            users = [
                ...JSON.parse(localUsers),
                {
                    id,
                    email,
                    password,
                    name: `${firstName} ${lastName}`
                }
            ];
        }

        window.localStorage.setItem('users', JSON.stringify(users));
    };

    const logout = () => {
        setSession(null);
        dispatch({ type: LOGOUT });
    };

    const resetPassword = async (email) => {
        console.log(email);
    };

    const updateProfile = () => {};

    if (state.isInitialized !== undefined && !state.isInitialized) {
        return <Loader />;
    }

    return (
        <JWTContext.Provider value={{ ...state, login, logout, register, resetPassword, updateProfile }}>{children}</JWTContext.Provider>
    );
};

JWTProvider.propTypes = {
    children: PropTypes.node
};

export default JWTContext;
