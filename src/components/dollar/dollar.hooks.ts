import { functions } from '@/core/appwriteClient';
import { useQuery } from '@tanstack/react-query';

interface DollarResponse {
  dollar?: number;
  ok?: string;
}

export const useDollar = () => {
  return useQuery<DollarResponse>({
    queryKey: ['dollar'],
    queryFn: async () => {
      const response = await functions.createExecution('dollar', '', false);
      const json = JSON.parse(response.responseBody);
      // console.log(json);
      return json;
    },
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    staleTime: 1000 * 60 * 4 // 4 minutes
  });
};
