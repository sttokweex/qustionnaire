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
      },
      body: JSON.stringify(data),
      credentials: 'include', // Добавление автоматической отправки куки
    }).then((res) => res.json());
  });
};

const useRegistrationMutation = () => {
  return useMutation((data: LoginData) => {
    return fetch(`${API_URL}/registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include', // Добавление автоматической отправки куки
    }).then((res) => res.json());
  });
};

const useLogoutMutation = () => {
  return useMutation(() => {
    return fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: {},
      credentials: 'include', // Добавление автоматической отправки куки
    });
  });
};

const useRefreshTokenMutation = () => {
  return useMutation(() => {
    return fetch(`${API_URL}/refresh`, {
      method: 'GET',
      credentials: 'include', // Добавление автоматической отправки куки
    }).then((res) => res.json());
  });
};

export {
  useLoginMutation,
  useRegistrationMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
};
