import { useMutation, useQuery } from 'react-query';
import axios from 'axios'; // Import Axios

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
const useLoginMutation = () => {
  return useMutation((data: LoginData) => {
    return axios
      .post(`${API_URL}/login`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Automatically send cookies
      })
      .then((res) => res.data);
  });
};

const useRegistrationMutation = () => {
  return useMutation((data: LoginData) => {
    return axios
      .post(`${API_URL}/registration`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Automatically send cookies
      })
      .then((res) => res.data);
  });
};

const useLogoutMutation = () => {
  return useMutation(() => {
    return axios.post(`${API_URL}/logout`, null, {
      headers: {
        'Content-Type': 'application/json', // Set the Content-Type header
      },
      withCredentials: true, // Automatically send cookies
    });
  });
};

const useRefreshTokenMutation = () => {
  return useMutation(() => {
    return axios
      .get(`${API_URL}/refresh`, {
        withCredentials: true,
      })
      .then((res) => res.data);
  });
};
const token = localStorage.getItem('token');
const useGetEmployees = () => {
  return useQuery<Employee[]>(
    'employees',
    async () => {
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
const useGetEmployee = (id: string | undefined) => {
  return useQuery(
    `employe_${id}`,
    () => {
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
