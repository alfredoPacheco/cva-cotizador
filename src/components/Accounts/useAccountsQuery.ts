import { useQuery } from '@tanstack/react-query';
import { functions } from '@/core/appwriteClient';
import type { Models } from 'appwrite';

const getAccounts = async () => {
  const resp = await functions.createExecution(
    'accounts',
    '',
    false,
    '/',
    'GET'
  );
  const json: { users: Models.User<Models.Preferences>[] } = JSON.parse(
    resp.responseBody
  );
  return json;
};

const useAccountsQuery = () => {
  return useQuery({ queryKey: ['accounts'], queryFn: () => getAccounts() });
};

export default useAccountsQuery;
