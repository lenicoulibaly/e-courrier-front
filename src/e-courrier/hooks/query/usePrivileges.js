import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { privilegeApi } from '../../api/administrationApi';

// Query keys
const PRIVILEGES_KEYS = {
    all: ['privileges'],
    lists: () => [...PRIVILEGES_KEYS.all, 'list'],
    list: (filters) => [...PRIVILEGES_KEYS.lists(), { ...filters }],
    byProfile: (profileCode) => [...PRIVILEGES_KEYS.all, 'byProfile', profileCode],
    byRole: (roleCode) => [...PRIVILEGES_KEYS.all, 'byRole', roleCode],
};

// Hooks for fetching privileges
export const useSearchPrivileges = (params = {}) => {
    return useQuery({
        queryKey: PRIVILEGES_KEYS.list(params),
        queryFn: () => privilegeApi.searchPrivileges(params),
    });
};

export const usePrivilegesByProfile = (profileCode, params = {}) => {
    return useQuery({
        queryKey: PRIVILEGES_KEYS.byProfile(profileCode),
        queryFn: () => privilegeApi.searchPrivilegesByProfile(profileCode, params),
        enabled: !!profileCode,
    });
};

export const usePrivilegesByRole = (roleCode, params = {}) => {
    return useQuery({
        queryKey: PRIVILEGES_KEYS.byRole(roleCode),
        queryFn: () => privilegeApi.searchPrivilegesByRole(roleCode, params),
        enabled: !!roleCode,
    });
};

// Hooks for privilege mutations
export const useCreatePrivilege = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (privilegeData) => privilegeApi.createPrivilege(privilegeData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRIVILEGES_KEYS.lists() });
        },
    });
};

export const useUpdatePrivilege = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (privilegeData) => privilegeApi.updatePrivilege(privilegeData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRIVILEGES_KEYS.lists() });
        },
    });
};

export const useCreatePrivileges = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (privilegesData) => privilegeApi.createPrivileges(privilegesData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRIVILEGES_KEYS.lists() });
        },
    });
};
