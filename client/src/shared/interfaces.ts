export interface LoginData {
  username: string;
  password: string;
}
export interface AuthResponse {
  accessToken: string;
  expirationTime: number;
  user: {
    id: number;
    username: string;
    role: string;
  };
}
export interface SurveyTheme {
  id: number;
  title: string;
}
export interface Survey {
  themeId: number;
  title: string;
  adminId: number;
  hidden: boolean;
}
export interface TokenData {
  token: string;
  exp: number;
}
