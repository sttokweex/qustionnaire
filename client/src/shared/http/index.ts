import axios from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axiosInstance from '@/api/axiosInstance';
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
queryClient.invalidateQueries('token');
const API_URL: string = 'http://localhost:3000';
interface LoginData {
  username: string;
  password: string;
}
interface AuthResponse {
  accessToken: string;
  expirationTime: number;
  user: {
    id: number;
    username: string;
    role: string;
  };
}
const useRefreshTokenMutation = (): UseMutationResult<
  AuthResponse,
  unknown,
  void,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation(
    (): Promise<AuthResponse> => {
      return axios
        .get<AuthResponse>(`${API_URL}/refresh`, {
          withCredentials: true,
        })
        .then((res) => res.data);
    },
    {
      onSuccess: (response) => {
        console.log(response.accessToken);

        console.log(queryClient.getQueryData('token'));
      },
    },
  );
};
const useLoginMutation = (): UseMutationResult<
  AuthResponse,
  unknown,
  LoginData,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: LoginData): Promise<AuthResponse> => {
      const res = await axiosInstance.post<AuthResponse>(`/login`, data, {
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
        queryClient.invalidateQueries('user');
        console.log(queryClient.getQueryData('user'));
      },
    },
  );
};

const useRegistrationMutation = (): UseMutationResult<
  AuthResponse,
  unknown,
  LoginData
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: LoginData): Promise<AuthResponse> => {
      const res = await axiosInstance.post<AuthResponse>(
        `/registration`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        },
      );
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
        queryClient.invalidateQueries('user');
        console.log(queryClient.getQueryData('user'));
      },
    },
  );
};

const useLogoutMutation = (): UseMutationResult<
  void,
  unknown,
  void,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation(
    (): Promise<void> => {
      return axiosInstance.post(`/logout`, null, {
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

export {
  useLoginMutation,
  useRegistrationMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
};
