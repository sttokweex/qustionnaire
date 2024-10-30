import { QueryObserverResult } from 'react-query';

interface UserData {
  username: string;
  id: number;
  role: string;
}
export interface Survey {
  id: number;
  title: string;
  isCompleted: boolean;
  hidden: boolean;
}
export interface SurveyThemePageProps {
  userData: UserData;
  refetch: (options?: {
    throwOnError?: boolean;
    cancelRefetch?: boolean;
  }) => Promise<QueryObserverResult<UserData | undefined, unknown>>;
}
