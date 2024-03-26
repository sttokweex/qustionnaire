import { Iuser } from '../IUser';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: Iuser;
}
