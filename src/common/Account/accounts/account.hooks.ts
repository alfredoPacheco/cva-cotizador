import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  defaultCreateMutation,
  defaultDeleteMutation
} from '@/core/ReactQueryProvider/defaultMutations';
import type { AccountDto } from './account';
import { useForm } from 'react-hook-form';
import { useDebounce } from '@/core';
import get from 'lodash/get';
import { functions } from '@/core/appwriteClient';
import omit from 'lodash/omit';

const USERS_FN = import.meta.env.PUBLIC_APPWRITE_FUNCTION_USERS!;

const QUERY_KEY = 'accounts';

const parseResponse = (resp: any) => {
  let response;
  try {
    const hasBody = get(resp, 'responseBody', false);
    if (hasBody) response = JSON.parse(resp.responseBody);
    else response = JSON.parse(resp);
  } catch {
    response = resp;
  }
  if (response?.status === 'failed') {
    throw new Error('Function error');
  }
  if (response?.error) {
    if (response.error.response) {
      throw response.error.response;
    }
    throw response.error;
  }
  console.log('response: ', response);
  return response;
};

export const listUsers = async (query = '') => {
  // console.log('should send query: ', query);
  const resp = await functions.createExecution(
    USERS_FN,
    undefined,
    false,
    '/',
    'GET'
  );
  return parseResponse(resp);
};

export const createUser = async data => {
  console.log('createuser: ', data);
  if (!data) throw new Error('data is required');

  const payload = JSON.stringify(omit(data, ['$id']));

  const resp = await functions.createExecution(
    USERS_FN,
    payload,
    false,
    '/',
    'POST'
  );
  return parseResponse(resp);
};

export const listIdentities = async () => {
  const resp = await functions.createExecution(
    USERS_FN,
    undefined,
    false,
    `/identities`,
    'GET'
  );
  const json = JSON.parse(resp.responseBody);
  return json;
};

export const deleteIdentity = async (id: string) => {
  const resp = await functions.createExecution(
    USERS_FN,
    undefined,
    false,
    `/identities/${id}`,
    'DELETE'
  );
  const json = JSON.parse(resp.responseBody);
  return json;
};

export const getUser = async (id: string) => {
  const resp = await functions.createExecution(
    USERS_FN,
    undefined,
    false,
    `/${id}`,
    'GET'
  );
  return parseResponse(resp);
};

export const deleteUser = async (id: string) => {
  const resp = await functions.createExecution(
    USERS_FN,
    undefined,
    false,
    `/${id}`,
    'DELETE'
  );
  return parseResponse(resp);
};

export const updateEmail = async (id: string, email: string) => {
  const resp = await functions.createExecution(
    USERS_FN,
    JSON.stringify({ email }),
    false,
    `/${id}/email`,
    'PATCH'
  );
  return parseResponse(resp);
};

export const updateUserLabels = async (id: string, labels: any) => {
  const resp = await functions.createExecution(
    USERS_FN,
    JSON.stringify({ labels }),
    false,
    `/${id}/labels`,
    'PUT'
  );
  return parseResponse(resp);
};

export const listUserLogs = async (id: string) => {
  const resp = await functions.createExecution(
    USERS_FN,
    undefined,
    false,
    `/${id}/logs`,
    'GET'
  );
  const json = JSON.parse(resp.responseBody);
  return json;
};

export const listUserMemberships = async (id: string) => {
  const resp = await functions.createExecution(
    USERS_FN,
    undefined,
    false,
    `/${id}/memberships`,
    'GET'
  );
  return parseResponse(resp);
};

export const updateName = async (id: string, name: string) => {
  const resp = await functions.createExecution(
    USERS_FN,
    JSON.stringify({ name }),
    false,
    `/${id}/name`,
    'PATCH'
  );
  return parseResponse(resp);
};

export const updatePassword = async (id: string, password: string) => {
  const resp = await functions.createExecution(
    USERS_FN,
    JSON.stringify({ password }),
    false,
    `/${id}/password`,
    'PATCH'
  );
  return parseResponse(resp);
};

export const updatePhone = async (id: string, phone: string) => {
  const resp = await functions.createExecution(
    USERS_FN,
    JSON.stringify({ phone }),
    false,
    `/${id}/phone`,
    'PATCH'
  );
  return parseResponse(resp);
};

export const getUserPrefs = async (id: string) => {
  console.log('id: ', id);
  const resp = await functions.createExecution(
    USERS_FN,
    undefined,
    false,
    `/${id}/prefs`,
    'GET'
  );
  return parseResponse(resp);
};

export const updateUserPrefs = async (id: string, prefs: any) => {
  const resp = await functions.createExecution(
    USERS_FN,
    JSON.stringify({ prefs }),
    false,
    `/${id}/prefs`,
    'PATCH'
  );
  return parseResponse(resp);
};

export const listUserSessions = async (id: string) => {
  const resp = await functions.createExecution(
    USERS_FN,
    undefined,
    false,
    `/${id}/sessions`,
    'GET'
  );
  const json = JSON.parse(resp.responseBody);
  return json;
};

export const deleteUserSessions = async (id: string) => {
  const resp = await functions.createExecution(
    USERS_FN,
    undefined,
    false,
    `/${id}/sessions`,
    'DELETE'
  );
  const json = JSON.parse(resp.responseBody);
  return json;
};

export const deleteUserSession = async (id: string, sessionId: string) => {
  const resp = await functions.createExecution(
    USERS_FN,
    undefined,
    false,
    `/${id}/session/${sessionId}`,
    'DELETE'
  );
  const json = JSON.parse(resp.responseBody);
  return json;
};

export const activateUser = async (id: string) => {
  const resp = await functions.createExecution(
    USERS_FN,
    undefined,
    false,
    `/${id}/activate`,
    'GET'
  );
  return parseResponse(resp);
};

export const deactivateUser = async (id: string) => {
  const resp = await functions.createExecution(
    USERS_FN,
    undefined,
    false,
    `/${id}/deactivate`,
    'GET'
  );
  return parseResponse(resp);
};

export const activateEmail = async (id: string) => {
  const resp = await functions.createExecution(
    USERS_FN,
    undefined,
    false,
    `/${id}/email/activate`,
    'GET'
  );
  return parseResponse(resp);
};

export const deactivateEmail = async (id: string) => {
  const resp = await functions.createExecution(
    USERS_FN,
    undefined,
    false,
    `/${id}/email/deactivate`,
    'GET'
  );
  return parseResponse(resp);
};

export const activatePhone = async (id: string) => {
  const resp = await functions.createExecution(
    USERS_FN,
    undefined,
    false,
    `/${id}/phone/activate`,
    'GET'
  );
  return parseResponse(resp);
};

export const deactivatePhone = async (id: string) => {
  const resp = await functions.createExecution(
    USERS_FN,
    undefined,
    false,
    `/${id}/phone/deactivate`,
    'GET'
  );
  return parseResponse(resp);
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
    enabled,
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
export const useAccountUpdatePhone = () => {
  return useMutation({
    // ...defaultUpdateMutation([QUERY_KEY], useQueryClient()),
    mutationFn: async ({ $id, prefs }: any) => {
      const resp = await updateUserPrefs($id, prefs);
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
export const useAccountDelete = () => {
  return useMutation({
    ...defaultDeleteMutation([QUERY_KEY], useQueryClient()),
    mutationFn: async (id: string) => {
      const resp = await deleteUser(id);
      return resp;
    }
  });
};
