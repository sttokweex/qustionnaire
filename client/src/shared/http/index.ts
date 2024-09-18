import axios from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
const API_URL: string = 'http://localhost:3000';

interface LoginData {
  username: string;
  password: string;
}

const useLoginMutation = (): UseMutationResult<
  any,
  unknown,
  LoginData,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: LoginData): Promise<any> => {
      const res = await axios.post(`${API_URL}/login`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      return res.data;
    },
    {
      onSuccess: (response) => {
        queryClient.setQueryData('user', response.user.username);
        localStorage.setItem('user', response.user.username);
        queryClient.setQueryData('token', {
          token: response.accessToken,
          exp: response.expirationTime,
        });
        localStorage.setItem(
          'token',
          JSON.stringify({
            token: response.accessToken,

            exp: response.expirationTime,
          }),
        );
        queryClient.invalidateQueries;
        console.log(queryClient.getQueryData('user'));
      },
    },
  );
};

const useRegistrationMutation = (): UseMutationResult<
  any,
  unknown,
  LoginData
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: LoginData): Promise<any> => {
      const res = await axios.post(`${API_URL}/registration`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      return res.data;
    },
    {
      onSuccess: (response) => {
        queryClient.setQueryData('user', response.user.username);
        localStorage.setItem('user', response.user.username);
        queryClient.setQueryData('token', {
          token: response.accessToken,
          exp: response.expirationTime,
        });
        localStorage.setItem(
          'token',
          JSON.stringify({
            token: response.accessToken,
            exp: response.expirationTime,
          }),
        );
        queryClient.invalidateQueries;
        console.log(queryClient.getQueryData('user'));
      },
    },
  );
};

const useLogoutMutation = (): UseMutationResult<
  any,
  unknown,
  void,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation(
    (): Promise<any> => {
      return axios.post(`${API_URL}/logout`, null, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
    },
    {
      onSuccess: () => {
        queryClient.removeQueries('user');
        queryClient.removeQueries('token');
        localStorage.clear();
      },
    },
  );
};

const useRefreshTokenMutation = (): UseMutationResult<
  any,
  unknown,
  void,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation(
    (): Promise<any> => {
      return axios
        .get(`${API_URL}/refresh`, {
          withCredentials: true,
        })
        .then((res) => res.data);
    },
    {
      onSuccess: (response) => {
        queryClient.setQueryData('user', response.user.username);
        localStorage.setItem('user', response.user.username);
        queryClient.setQueryData('token', {
          token: response.accessToken,
          exp: response.expirationTime,
        });
        localStorage.setItem(
          'token',
          JSON.stringify({
            token: response.accessToken,
            exp: response.expirationTime,
          }),
        );
        queryClient.invalidateQueries;
        console.log(queryClient.getQueryData('token'));
      },
    },
  );
};

export {
  useLoginMutation,
  useRegistrationMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
};
