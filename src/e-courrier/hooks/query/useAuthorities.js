import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authorityApi, roleApi, profileApi } from '../../api/administrationApi';

// Query keys
const AUTHORITIES_KEYS = {
    all: ['authorities'],
    user: (username) => [...AUTHORITIES_KEYS.all, 'user', username],
};


const ROLES_KEYS = {
    all: ['roles'],
    lists: () => [...ROLES_KEYS.all, 'list'],
    list: (filters) => [...ROLES_KEYS.lists(), { ...filters }],
    byProfile: (profileCode, params) => [...ROLES_KEYS.all, 'byProfile', profileCode, { ...params }],
};

const PROFILES_KEYS = {
    all: ['profiles'],
    lists: () => [...PROFILES_KEYS.all, 'list'],
    list: (filters) => [...PROFILES_KEYS.lists(), { ...filters }],
    byUser: (userId, params) => [...PROFILES_KEYS.all, 'byUser', userId, { ...params }],
};

// Hooks for fetching authorities
export const useUserAuthorities = (username) => {
    return useQuery({
        queryKey: AUTHORITIES_KEYS.user(username),
        queryFn: () => authorityApi.getUserAuthorities(username),
        enabled: !!username,
    });
};

// Hooks for roles
export const useRoles = (params = {}) => {
    return useQuery({
        queryKey: ROLES_KEYS.list(params),
        queryFn: () => roleApi.searchRoles(params),
    });
};

export const useRolesByProfile = (profileCode, params = {}) => {
    return useQuery({
        queryKey: ROLES_KEYS.byProfile(profileCode, params),
        queryFn: () => roleApi.searchRolesByProfile(profileCode, params),
        enabled: !!profileCode,
    });
};

export const useCreateRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (roleData) => roleApi.createRole(roleData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ROLES_KEYS.lists() });
        },
    });
};

export const useUpdateRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (roleData) => roleApi.updateRole(roleData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ROLES_KEYS.lists() });
        },
    });
};

// Hooks for profiles
export const useProfiles = (params = {}) => {
    return useQuery({
        queryKey: PROFILES_KEYS.list(params),
        queryFn: () => profileApi.searchProfiles(params),
    });
};

export const useProfilesByUser = (userId, params = {}) => {
    return useQuery({
        queryKey: PROFILES_KEYS.byUser(userId, params),
        queryFn: () => profileApi.searchProfilesByUser(userId, params),
        enabled: !!userId,
    });
};

export const useCreateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (profileData) => profileApi.createProfile(profileData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PROFILES_KEYS.lists() });
        },
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (profileData) => profileApi.updateProfile(profileData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PROFILES_KEYS.lists() });
        },
    });
};

export const useAddProfileToUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (profileUserData) => profileApi.addProfileToUser(profileUserData),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: PROFILES_KEYS.byUser(variables.userId) });
            queryClient.invalidateQueries({ queryKey: AUTHORITIES_KEYS.all });
        },
    });
};
