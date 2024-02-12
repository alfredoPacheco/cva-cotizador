import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  defaultCreateMutation,
  defaultDeleteMutation
} from '@/core/ReactQueryProvider/defaultMutations';
import type { AccountDto } from './account';
import { useForm } from 'react-hook-form';
import { useDebounce } from '@/core';
import { account, storage } from '@/core/appwriteClient';
import omit from 'lodash/omit';
import { Get, Post, Delete, Put, Patch } from '@/core/ApiService';

// const USERS_FN = import.meta.env.PUBLIC_APPWRITE_FUNCTION_USERS!;
const BASE_URL = import.meta.env.PUBLIC_NEST_HOST!;

const QUERY_KEY = 'accounts';

// const parseResponse = (resp: any) => {
//   let response;
//   try {
//     const hasBody = get(resp, 'responseBody', false);
//     if (hasBody) response = JSON.parse(resp.responseBody);
//     else response = JSON.parse(resp);
//   } catch {
//     response = resp;
//   }
//   if (response?.status === 'failed') {
//     throw new Error('Function error');
//   }
//   if (response?.error) {
//     if (response.error.response) {
//       throw response.error.response;
//     }
//     throw response.error;
//   }
//   console.log('response: ', response);
//   return response;
// };

export const getAccount = async () => {
  const acc = await account.get();
  const prefs = await account.getPrefs();
  acc.prefs = prefs;
  return acc;
};

export const listUsers = async (query = '') => {
  // console.log('should send query: ', query);
  const url = new URL(BASE_URL);
  url.pathname = '/users';
  const resp = await Get(url.toString());
  console.log('resp: ', resp);
  return resp;
};

const BUCKET_ID = import.meta.env.PUBLIC_APPWRITE_STORAGE_AVATARS;
export function getAvatarUrl(fileId?: string) {
  if (!fileId) return '';
  const f = storage.getFilePreview(BUCKET_ID, fileId);
  return f;
}

export const createUser = async data => {
  console.log('createuser: ', data);
  if (!data) throw new Error('data is required');

  const payload = omit(data, ['$id']);

  const url = new URL(BASE_URL);
  url.pathname = '/users';
  const resp = await Post(url.toString(), payload);
  console.log('resp: ', resp);
  return resp;
};

export const listIdentities = async () => {
  const url = new URL(BASE_URL);
  url.pathname = '/users/identities';
  const resp = await Get(url.toString());
  console.log('resp: ', resp);
  return resp;
};

export const deleteIdentity = async (userId: string, identityId: string) => {
  const url = new URL(BASE_URL);
  url.pathname = `/users/${userId}/identities/${identityId}`;
  const resp = await Delete(url.toString());
  console.log('resp: ', resp);
  return resp;
};

export const getUser = async (id: string) => {
  const url = new URL(BASE_URL);
  url.pathname = `/users/${id}`;
  const resp = await Get(url.toString());
  console.log('resp: ', resp);
  return resp;
};

export const deleteUser = async (id: string) => {
  const url = new URL(BASE_URL);
  url.pathname = `/users/${id}`;
  const resp = await Delete(url.toString());
  console.log('resp: ', resp);
  return resp;
};

export const updateEmail = async (id: string, email: string) => {
  const url = new URL(BASE_URL);
  url.pathname = `/users/${id}/email`;
  const resp = await Patch(url.toString(), { email });
  console.log('resp: ', resp);
  return resp;
};

export const updateUserLabels = async (id: string, labels: any) => {
  const url = new URL(BASE_URL);
  url.pathname = `/users/${id}/labels`;
  const resp = await Put(url.toString(), { labels });
  console.log('resp: ', resp);
  return resp;
};

export const listUserLogs = async (id: string) => {
  const url = new URL(BASE_URL);
  url.pathname = `/users/${id}/logs`;
  const resp = await Get(url.toString());
  console.log('resp: ', resp);
  return resp;
};

export const listUserMemberships = async (id: string) => {
  const url = new URL(BASE_URL);
  url.pathname = `/users/${id}/memberships`;
  const resp = await Get(url.toString());
  console.log('resp: ', resp);
  return resp;
};

export const updateName = async (id: string, name: string) => {
  const url = new URL(BASE_URL);
  url.pathname = `/users/${id}/name`;
  const resp = await Patch(url.toString(), { name });
  console.log('resp: ', resp);
  return resp;
};

export const updatePassword = async (id: string, password: string) => {
  const url = new URL(BASE_URL);
  url.pathname = `/users/${id}/password`;
  const resp = await Patch(url.toString(), { password });
  console.log('resp: ', resp);
  return resp;
};

export const updatePhone = async (id: string, phone: string) => {
  const url = new URL(BASE_URL);
  url.pathname = `/users/${id}/phone`;
  const resp = await Patch(url.toString(), { phone });
  console.log('resp: ', resp);
  return resp;
};

export const getUserPrefs = async (id: string) => {
  const url = new URL(BASE_URL);
  url.pathname = `/users/${id}/prefs`;
  const resp = await Get(url.toString());
  console.log('resp: ', resp);
  return resp;
};

export const updateUserPrefs = async (id: string, prefs: any) => {
  const url = new URL(BASE_URL);
  url.pathname = `/users/${id}/prefs`;
  const resp = await Patch(url.toString(), { prefs });
  console.log('resp: ', resp);
  return resp;
};

export const listUserSessions = async (id: string) => {
  const url = new URL(BASE_URL);
  url.pathname = `/users/${id}/sessions`;
  const resp = await Get(url.toString());
  console.log('resp: ', resp);
  return resp;
};

export const deleteUserSessions = async (id: string) => {
  const url = new URL(BASE_URL);
  url.pathname = `/users/${id}/sessions`;
  const resp = await Delete(url.toString());
  console.log('resp: ', resp);
  return resp;
};

export const deleteUserSession = async (id: string, sessionId: string) => {
  const url = new URL(BASE_URL);
  url.pathname = `/users/${id}/session/${sessionId}`;
  const resp = await Delete(url.toString());
  console.log('resp: ', resp);
  return resp;
};

export const activateUser = async (id: string) => {
  const url = new URL(BASE_URL);
  url.pathname = `/users/${id}/activate`;
  const resp = await Get(url.toString());
  console.log('resp: ', resp);
  return resp;
};

export const deactivateUser = async (id: string) => {
  const url = new URL(BASE_URL);
  url.pathname = `/users/${id}/deactivate`;
  const resp = await Get(url.toString());
  console.log('resp: ', resp);
  return resp;
};

export const activateEmail = async (id: string) => {
  const url = new URL(BASE_URL);
  url.pathname = `/users/${id}/email/activate`;
  const resp = await Get(url.toString());
  console.log('resp: ', resp);
  return resp;
};

export const deactivateEmail = async (id: string) => {
  const url = new URL(BASE_URL);
  url.pathname = `/users/${id}/email/deactivate`;
  const resp = await Get(url.toString());
  console.log('resp: ', resp);
  return resp;
};

export const activatePhone = async (id: string) => {
  const url = new URL(BASE_URL);
  url.pathname = `/users/${id}/phone/activate`;
  const resp = await Get(url.toString());
  console.log('resp: ', resp);
  return resp;
};

export const deactivatePhone = async (id: string) => {
  const url = new URL(BASE_URL);
  url.pathname = `/users/${id}/phone/deactivate`;
  const resp = await Get(url.toString());
  console.log('resp: ', resp);
  return resp;
};

export const useCurrentAccount = () => {
  return useQuery<AccountDto>({
    queryKey: ['currentAccount'],
    queryFn: async () => {
      const resp = await getAccount();
      return resp as AccountDto;
    }
  });
};

export const useAccountList = (enabled = true) => {
  const filtersForm = useForm(); // This form is to handle search and filters over list

  const debouncedSearch = useDebounce(filtersForm.watch('search'), 100);

  const query = useQuery<AccountDto[]>({
    queryKey: [QUERY_KEY],
    enabled,
    queryFn: async () => {
      const resp = await listUsers();
      return resp.users;
    }
  });

  return { query, filtersForm, debouncedSearch };
};

export const useAccountSingle = (id: string, enabled = true) => {
  return useQuery<AccountDto>({
    queryKey: [QUERY_KEY, id],
    enabled: enabled && !!id,
    queryFn: async () => {
      const resp = await getUser(id);
      return resp;
    }
  });
};

export const useAccountCreate = () => {
  return useMutation({
    ...defaultCreateMutation({
      queryKey: [QUERY_KEY],
      queryClient: useQueryClient(),
      appendMode: 'prepend'
    }),
    mutationFn: async (data: AccountDto) => {
      const resp = await createUser(data);
      return resp;
    }
  });
};

export const useAccountUpdatePassword = () => {
  return useMutation({
    // ...defaultUpdateMutation([QUERY_KEY], useQueryClient()),
    mutationFn: async ({ $id, password }: any) => {
      const resp = await updatePassword($id, password);
      return resp;
    }
  });
};

export const useAccountUpdateName = () => {
  return useMutation({
    // ...defaultUpdateMutation([QUERY_KEY], useQueryClient()),
    mutationFn: async ({ $id, name }: any) => {
      const resp = await updateName($id, name);
      return resp;
    }
  });
};

export const useAccountUpdatePrefs = () => {
  return useMutation({
    // ...defaultUpdateMutation([QUERY_KEY], useQueryClient()),
    mutationFn: async ({ $id, prefs }: any) => {
      const payload = omit(prefs, ['_attachments']);
      const resp = await updateUserPrefs($id, payload);
      return resp;
    }
  });
};

export const useAccountUpdatePhone = () => {
  return useMutation({
    // ...defaultUpdateMutation([QUERY_KEY], useQueryClient()),
    mutationFn: async ({ $id, phone }: any) => {
      const resp = await updatePhone($id, phone);
      return resp;
    }
  });
};
export const useAccountUpdateEmail = () => {
  return useMutation({
    // ...defaultUpdateMutation([QUERY_KEY], useQueryClient()),
    mutationFn: async ({ $id, email }: any) => {
      const resp = await updateEmail($id, email);
      return resp;
    }
  });
};
export const useAccountUpdateLabels = () => {
  return useMutation({
    mutationFn: async ({ $id, labels }: any) => {
      const resp = await updateUserLabels($id, labels);
      return resp;
    }
  });
};
export const useAccountDelete = () => {
  return useMutation({
    ...defaultDeleteMutation([QUERY_KEY], useQueryClient()),
    mutationFn: async (id: string) => {
      const resp = await deleteUser(id);
      return resp;
    }
  });
};
