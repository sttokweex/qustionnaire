import { QueryObserverResult } from '@tanstack/react-query';

export interface LoginData {
  username: string;
  password: string;
}
export interface Question {
  id: number;
  questionText: string;
  answerOptions: string[];
  answerType: string;
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
export interface Answer {
  id: number;
  questionId: number;
  answerText: string;
}
export interface SurveyTheme {
  id: string;
  title: string;
}
export interface Survey {
  id: number;
  themeId: number;
  title: string;
  hidden: boolean;
  isCompleted: boolean;
}
export interface TokenData {
  token: string;
  exp: number;
}
export interface SurveyResponse {
  survey: Survey;
  questions: Question[];
  answers: Answer[];
}
export interface UserData {
  username: string;
  id: number;
  role: string;
}
export interface Refetch {
  (options?: {
    throwOnError?: boolean;
    cancelRefetch?: boolean;
  }): Promise<QueryObserverResult<UserData | undefined, unknown>>;
}
