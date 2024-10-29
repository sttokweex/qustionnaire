import { QueryObserverResult } from 'react-query';

interface UserData {
  username: string;
  id: number;
  role: string;
}
export interface Survey {
  title: string;
  isCompleted: boolean;
}
export interface SurveyThemePageProps {
  userData: UserData;
  refetch: (options?: {
    throwOnError?: boolean;
    cancelRefetch?: boolean;
  }) => Promise<QueryObserverResult<UserData | undefined, unknown>>;
}
