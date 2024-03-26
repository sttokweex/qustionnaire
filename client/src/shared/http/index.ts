import { useMutation } from 'react-query';

const API_URL: string = 'http://localhost:3000';

interface LoginData {
  username: string;
  password: string;
}

const useLoginMutation = () => {
  return useMutation((data: LoginData) => {
    return fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') as string}`,
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());
  });
};

const useRegistrationMutation = () => {
  return useMutation((data) => {
    return fetch(`${API_URL}/registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());
  });
};

const useLogoutMutation = () => {
  return useMutation(() => {
    return fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  });
};

export { useLoginMutation, useRegistrationMutation, useLogoutMutation };
