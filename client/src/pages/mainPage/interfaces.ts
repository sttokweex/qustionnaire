import { QueryObserverResult } from 'react-query';

export interface UserData {
  username: string;
  id: number;
  role: string;
}

export interface MainPageProps {
  userData: UserData;
  refetch: (options?: {
    throwOnError?: boolean;
    cancelRefetch?: boolean;
  }) => Promise<QueryObserverResult<UserData | undefined, unknown>>;
}
