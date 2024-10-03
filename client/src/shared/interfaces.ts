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
  id: number;
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
