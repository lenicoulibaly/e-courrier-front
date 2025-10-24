# React Query Implementation

Ce document décrit l'implémentation de React Query (TanStack Query) dans le projet e-courrier.

## Introduction

React Query est une bibliothèque de gestion d'état et de requêtes pour les applications React. Elle simplifie la récupération, la mise en cache, la synchronisation et la mise à jour des données côté serveur.

## Structure de l'implémentation

L'implémentation de React Query dans ce projet est organisée comme suit :

### 1. Provider

Le `QueryProvider` est configuré dans `src/e-courrier/providers/QueryProvider.jsx`. Il initialise le client React Query avec des options par défaut et fournit les fonctionnalités de React Query à toute l'application.

```jsx
// src/sigma/providers/QueryProvider.jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 minutes
        },
    },
});

const QueryProvider = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};
```

### 2. API Adaptée

Les fonctions API dans `src/e-courrier/api/administrationApi.js` ont été adaptées pour fonctionner avec React Query. Elles retournent maintenant directement les données de la réponse au lieu de l'objet de réponse complet.

### 3. Hooks React Query

Des hooks personnalisés ont été créés pour chaque catégorie d'API :

- `useUsers.js` - Hooks pour les opérations liées aux utilisateurs
- `useStructures.js` - Hooks pour les opérations liées aux structures
- `useAuthorities.js` - Hooks pour les opérations liées aux autorités, privilèges, rôles et profils
- `useTypes.js` - Hooks pour les opérations liées aux types et groupes de types

Ces hooks sont exportés via un fichier index dans `src/e-courrier/hooks/query/index.js`.

## Utilisation

### Requêtes (Queries)

Pour récupérer des données, utilisez les hooks de requête :

```jsx
import { useUsers, useStructures } from 'sigma/hooks/query';

const MyComponent = () => {
    // Récupérer la liste des utilisateurs
    const { data: users, isLoading, error } = useUsers({ page: 0, size: 10 });

    // Récupérer les structures racines
    const { data: rootStructures } = useRootStructures();

    if (isLoading) return <div>Chargement...</div>;
    if (error) return <div>Erreur: {error.message}</div>;

    return (
        <div>
            {users.map(user => (
                <div key={user.id}>{user.username}</div>
            ))}
        </div>
    );
};
```

### Mutations

Pour modifier des données, utilisez les hooks de mutation :

```jsx
import { useCreateUser, useUpdateUser } from 'sigma/hooks/query';

const UserForm = () => {
    const createUser = useCreateUser();
    const updateUser = useUpdateUser();

    const handleSubmit = (userData) => {
        if (userData.id) {
            updateUser.mutate(userData, {
                onSuccess: (data) => {
                    console.log('Utilisateur mis à jour:', data);
                },
                onError: (error) => {
                    console.error('Erreur:', error);
                }
            });
        } else {
            createUser.mutate(userData, {
                onSuccess: (data) => {
                    console.log('Utilisateur créé:', data);
                },
                onError: (error) => {
                    console.error('Erreur:', error);
                }
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Champs du formulaire */}
        </form>
    );
};
```

## Avantages de React Query

1. **Mise en cache automatique** - Les données sont mises en cache et réutilisées lorsque c'est possible.
2. **Invalidation intelligente** - Les données sont automatiquement invalidées et rechargées lorsque nécessaire.
3. **Gestion des états de chargement et d'erreur** - Facilite la gestion des états de chargement et d'erreur.
4. **Pagination et requêtes infinies** - Simplifie la pagination et les requêtes infinies.
5. **Dépendances de requête** - Permet de définir des dépendances entre les requêtes.
6. **Prefetching** - Permet de précharger des données avant qu'elles ne soient nécessaires.

## Migration depuis Redux

Pour migrer du code existant qui utilise Redux vers React Query :

1. Identifiez les actions Redux qui effectuent des appels API.
2. Remplacez ces actions par les hooks React Query correspondants.
3. Mettez à jour les composants pour utiliser les données et les états de React Query au lieu de Redux.

Exemple de migration :

**Avant (avec Redux) :**
```jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchUsers } from 'sigma/store/slices/userSlice';

const UserList = () => {
    const dispatch = useDispatch();
    const { users, isLoading, error } = useSelector(state => state.users);

    useEffect(() => {
        dispatch(searchUsers({ page: 0, size: 10 }));
    }, [dispatch]);

    if (isLoading) return <div>Chargement...</div>;
    if (error) return <div>Erreur: {error}</div>;

    return (
        <div>
            {users.map(user => (
                <div key={user.id}>{user.username}</div>
            ))}
        </div>
    );
};
```

**Après (avec React Query) :**
```jsx
import { useUsers } from 'sigma/hooks/query';

const UserList = () => {
    const { data: users, isLoading, error } = useUsers({ page: 0, size: 10 });

    if (isLoading) return <div>Chargement...</div>;
    if (error) return <div>Erreur: {error.message}</div>;

    return (
        <div>
            {users.map(user => (
                <div key={user.id}>{user.username}</div>
            ))}
        </div>
    );
};
```

## Ressources

- [Documentation officielle de React Query](https://tanstack.com/query/latest/docs/react/overview)
- [Guide de migration de Redux vers React Query](https://tanstack.com/query/latest/docs/react/guides/migrating-to-react-query)