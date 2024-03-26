import $api from '../http';
import { AxiosResponse } from 'axios';
import { Iuser } from '../models/IUser';

export default class UserService {
  static fetchUsers(): Promise<AxiosResponse<Iuser[]>> {
    return $api.get<Iuser[]>('/users');
  }
}
