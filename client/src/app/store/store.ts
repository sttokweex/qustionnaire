import { makeAutoObservable } from 'mobx';
import { useLoginMutation } from '../../shared/http';
import { useRegistrationMutation } from '../../shared/http';
import { useLogoutMutation } from '../../shared/http';
import { useRefreshTokenMutation } from '../../shared/http';

interface IUser {
  id: number;
  role: string;
  username: string;
}
interface IEmployee {
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
interface IResponse {
  accessToken: string;
  expirationTime: string;
  refreshToken: string;
  user: IUser;
}
export default class Store {
  user = {} as IUser;
  isAuth = false;
  isLoading = true;
  employee = {} as IEmployee;

  constructor() {
    makeAutoObservable(this);
    this.loadFromLocalStorage();
  }
  async loadFromLocalStorage() {
    const storedEmployee = localStorage.getItem('employee');
    if (storedEmployee) {
      this.setEmployee(JSON.parse(storedEmployee));
    }
  }
  setAuth(bool: boolean) {
    this.isAuth = bool;
  }

  setUser(user: IUser) {
    this.user = user;
  }
  setEmployee(employee: IEmployee) {
    localStorage.setItem('employee', JSON.stringify(employee));
    this.employee = employee;
  }

  setLoading(bool: boolean) {
    this.isLoading = bool;
  }

  async login(
    username: string,
    password: string,
    mutation: ReturnType<typeof useLoginMutation>,
  ) {
    try {
      const formData = {
        username: username,
        password: password,
      };

      mutation.mutate(formData, {
        onSuccess: (response: IResponse) => {
          if (response.user) {
            localStorage.setItem('expirationTime', response.expirationTime);
            localStorage.setItem('token', response.accessToken);
            this.setAuth(true);
            this.setUser(response.user);
          }
        },
        onError: (error) => {
          console.error('Ошибка сервера:', error);
        },
      });
    } catch (e: any) {
      console.log(e.response?.data?.message, 'qweqewew');
    }
  }

  async registration(
    username: string,
    password: string,
    mutation: ReturnType<typeof useRegistrationMutation>,
  ) {
    try {
      const formData = {
        username: username,
        password: password,
      };

      mutation.mutate(formData, {
        onSuccess: (response) => {
          if (response.user) {
            localStorage.setItem('expirationTime', response.expirationTime);
            localStorage.setItem('token', response.accessToken);
            this.setAuth(true);
            this.setUser(response.user);
          }
        },
        onError: (error) => {
          console.error('Ошибка сервера:', error);
        },
      });
    } catch (e: any) {
      console.log(e.response?.data?.message);
    }
  }

  async logout(mutation: ReturnType<typeof useLogoutMutation>) {
    try {
      mutation.mutate();
      localStorage.removeItem('token');
      this.setAuth(false);
      this.setUser({} as IUser);
    } catch (e: any) {
      console.log(e.response?.data?.message);
    }
  }

  async checkAuth(mutation: ReturnType<typeof useRefreshTokenMutation>) {
    try {
      const response = await mutation.mutateAsync(); // Используем mutateAsync() для получения промисса с результатом выполнения мутации

      if (!response.user) {
        this.setAuth(false);
      } else {
        this.setLoading(true);

        localStorage.setItem('token', response.accessToken);
        this.setAuth(true);
        this.setUser(response.user);
      }
    } catch (e: any) {
      console.log(e);
    } finally {
      this.setLoading(false);
    }
  }
}
