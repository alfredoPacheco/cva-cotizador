import { useQuery } from '@tanstack/react-query';
import { functions } from '@/core/appwrite';
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
  return useQuery(['accounts'], () => getAccounts());
};

export default useAccountsQuery;
