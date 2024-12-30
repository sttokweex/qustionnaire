import { UserData } from '@/entity/user';
import { QueryObserverResult } from '@tanstack/react-query';

export interface LoginData {
  username: string;
  password: string;
}

export interface Refetch {
  (options?: {
    throwOnError?: boolean;
    cancelRefetch?: boolean;
  }): Promise<QueryObserverResult<UserData | undefined, unknown>>;
}
