import { makeAutoObservable } from 'mobx';
import { Iuser } from '../../../shared/models/IUser';
import AuthService from '../../../shared/services/AuthServices';

export default class Store {
  user = {} as Iuser;
  isAuth = false;
  constructor() {
    makeAutoObservable(this);
  }
  setAuth(bool: boolean) {
    this.isAuth = bool;
  }
  setUser(user: Iuser) {
    this.user = user;
  }
  async login(username: string, password: string) {
    try {
      const response = await AuthService.login(username, password);
      console.log(response);
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e: any) {
      console.log(e.response?.data?.message);
    }
  }
  async registration(username: string, password: string) {
    try {
      const response = await AuthService.registration(username, password);
      console.log(response);
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e: any) {
      console.log(e.response?.data?.message);
    }
  }
  async logout() {
    try {
      const response = await AuthService.logout();
      console.log(response);
      localStorage.removeItem('token');
      this.setAuth(false);
      this.setUser({} as Iuser);
    } catch (e: any) {
      console.log(e.response?.data?.message);
    }
  }
}
