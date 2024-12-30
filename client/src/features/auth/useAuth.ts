import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { refreshToken, useLogoutMutation } from '@/shared/http';
import { UserData } from '@/entity/user';

const useAuth = () => {
  const queryClient = useQueryClient();
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const {
    data: userData,
    isLoading,
    refetch,
  } = useQuery<UserData | undefined>({
    queryKey: ['user'],
    queryFn: () => {
      return queryClient.getQueryData<UserData>(['user']);
    },
    placeholderData: undefined,
    staleTime: Infinity,
  });

  const mutationLogout = useLogoutMutation(refetch);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      refreshToken()
        .then((response) => {
          if (response.user) {
            queryClient.setQueryData(['user'], response.user);
          }
        })
        .catch(() => {
          mutationLogout.mutate();
        })
        .finally(() => {
          setIsAuthLoading(false);
        });
    } else {
      setIsAuthLoading(false);
    }
  }, [queryClient]);

  return { userData, isLoading, isAuthLoading, refetch };
};

export default useAuth;
