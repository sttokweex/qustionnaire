import { QueryObserverResult } from '@tanstack/react-query';

export interface Question {
  id: number;
  questionText: string;
  answerOptions: string[];
  answerType: string;
}

export interface Answer {
  id: number;
  questionId: number;
  answerText: string;
}
export interface UserData {
  username: string;
  id: number;
  role: string;
}
export interface QuestionPageProps {
  userData: UserData;
  refetch: (options?: {
    throwOnError?: boolean;
    cancelRefetch?: boolean;
  }) => Promise<QueryObserverResult<UserData | undefined, unknown>>;
}
