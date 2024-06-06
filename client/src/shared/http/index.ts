import axios from 'axios';
import {
  useMutation,
  useQuery,
  UseMutationResult,
  UseQueryResult,
} from 'react-query';

const API_URL: string = 'http://localhost:3000';

interface LoginData {
  username: string;
  password: string;
}

interface Employee {
  id: number;
  initials: string;
  gender: string;
  birth_data: string;
  indetificator: string;
  phone: string;
  email: string;
  additional_info: string;
  snils: string;
}

const useLoginMutation = (): UseMutationResult<
  any,
  unknown,
  LoginData,
  unknown
> => {
  return useMutation((data: LoginData): Promise<any> => {
    return axios
      .post(`${API_URL}/login`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      .then((res) => res.data);
  });
};

const useRegistrationMutation = (): UseMutationResult<
  any,
  unknown,
  LoginData,
  unknown
> => {
  return useMutation((data: LoginData): Promise<any> => {
    return axios
      .post(`${API_URL}/registration`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      .then((res) => res.data);
  });
};

const useLogoutMutation = (): UseMutationResult<
  any,
  unknown,
  void,
  unknown
> => {
  return useMutation((): Promise<any> => {
    return axios.post(`${API_URL}/logout`, null, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
  });
};

const useRefreshTokenMutation = (): UseMutationResult<
  any,
  unknown,
  void,
  unknown
> => {
  return useMutation((): Promise<any> => {
    return axios
      .get(`${API_URL}/refresh`, {
        withCredentials: true,
      })
      .then((res) => res.data);
  });
};

const token: string | null = localStorage.getItem('token');

const useGetEmployees = (): UseQueryResult<Employee[], unknown> => {
  return useQuery<Employee[]>(
    'employees',
    async (): Promise<Employee[]> => {
      return axios
        .get(`${API_URL}/employe`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => res.data);
    },
    {
      staleTime: 500000,
    },
  );
};

const useGetEmployee = (
  id: string | undefined,
): UseQueryResult<any, unknown> => {
  return useQuery(
    `employe_${id}`,
    (): Promise<any> => {
      return axios
        .get(`${API_URL}/employe/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => res.data);
    },
    {
      staleTime: 500000,
    },
  );
};

export {
  useLoginMutation,
  useRegistrationMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetEmployees,
  useGetEmployee,
};
