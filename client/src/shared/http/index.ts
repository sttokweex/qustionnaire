import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import axios from 'axios';
import { LoginData } from '../types/interfaces';
import axiosInstance from '@/api/axiosInstance';
import { API_URL } from '../constants/config';
import { Answer } from '@/entity/answer';
import { Question } from '@/entity/question';
import { Survey } from '@/entity/survey';
import { SurveyTheme } from '@/entity/surveyTheme';

export interface AuthResponse {
  accessToken: string;
  expirationTime: number;
  user: {
    id: number;
    username: string;
    role: string;
  };
}
const refreshToken = async (): Promise<AuthResponse> => {
  try {
    const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
      withCredentials: true,
    });
    const data = response.data;

    localStorage.setItem(
      'token',
      JSON.stringify({
        token: data.accessToken,
        exp: data.expirationTime,
      }),
    );

    return data;
  } catch (error) {
    localStorage.removeItem('token');

    throw error;
  }
};

const useLoginMutation = (): UseMutationResult<
  AuthResponse,
  unknown,
  LoginData,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, unknown, LoginData>({
    mutationFn: async (data: LoginData): Promise<AuthResponse> => {
      const res = await axiosInstance.post<AuthResponse>('/login', data, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      return res.data;
    },
    onSuccess: (response) => {
      queryClient.setQueryData(['user'], response.user);
      localStorage.setItem(
        'token',
        JSON.stringify({
          token: response.accessToken,
          exp: response.expirationTime,
        }),
      );
    },
  });
};

const useRegistrationMutation = (): UseMutationResult<
  AuthResponse,
  unknown,
  LoginData
> => {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, unknown, LoginData>({
    mutationFn: async (data: LoginData): Promise<AuthResponse> => {
      const res = await axiosInstance.post<AuthResponse>(
        '/registration',
        data,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      );

      return res.data;
    },
    onSuccess: (response) => {
      queryClient.setQueryData(['user'], response.user);

      localStorage.setItem(
        'token',
        JSON.stringify({
          token: response.accessToken,
          exp: response.expirationTime,
        }),
      );
    },
  });
};

const useLogoutMutation = (
  refetchUserData: () => void,
): UseMutationResult<void, unknown, void> => {
  const queryClient = useQueryClient();

  return useMutation<void>({
    mutationFn: async (): Promise<void> => {
      await axiosInstance.post('/logout', null, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['user'] });
      localStorage.clear();
      refetchUserData();
    },
  });
};

const useSurveyThemes = (): UseQueryResult<SurveyTheme[], Error> => {
  return useQuery<SurveyTheme[], Error>({
    queryKey: ['surveyThemes'],
    queryFn: async () => {
      const response = await axiosInstance.get<SurveyTheme[]>('/surveyThemes', {
        withCredentials: true,
      });

      return response.data;
    },
  });
};

const useSurveysByTheme = (title: string): UseQueryResult<Survey[], Error> => {
  return useQuery<Survey[], Error>({
    queryKey: ['surveys', title],
    queryFn: async () => {
      const response = await axiosInstance.post<Survey[]>(
        '/surveys',
        { title },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      );

      return response.data;
    },
  });
};

const useAddSurveyThemeMutation = (): UseMutationResult<
  SurveyTheme,
  unknown,
  { title: string }
> => {
  const queryClient = useQueryClient();

  return useMutation<SurveyTheme, unknown, { title: string }>({
    mutationFn: async (data: { title: string }): Promise<SurveyTheme> => {
      const res = await axiosInstance.post<SurveyTheme>(
        '/addSurveyTheme',
        data,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      );

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveyThemes'] });
    },
  });
};
type QuestionWithoutId = Omit<Question, 'id'>;
const useAddSurveyMutation = (): UseMutationResult<
  Survey,
  unknown,
  {
    survey: { title: string; questions: QuestionWithoutId[] };
    themeTitle: string;
    flag: boolean;
  }
> => {
  const queryClient = useQueryClient();

  return useMutation<
    Survey,
    unknown,
    {
      survey: { title: string; questions: QuestionWithoutId[] };
      themeTitle: string;
      flag: boolean;
    }
  >({
    mutationFn: async (data): Promise<Survey> => {
      const res = await axiosInstance.post<Survey>('/addSurvey', data, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
    },
  });
};
export interface SurveyResponse {
  survey: Survey;
  questions: Question[];
  answers: Answer[];
}
const useGetQuestions = (
  title: string,
): UseQueryResult<SurveyResponse, Error> => {
  return useQuery<SurveyResponse, Error>({
    queryKey: ['survey', title],
    queryFn: async () => {
      const response = await axiosInstance.post<SurveyResponse>(
        '/survey',
        { title },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      );

      return response.data;
    },
  });
};

const useSubmitSurveyMutation = (): UseMutationResult<
  SurveyResponse,
  unknown,
  {
    endedSurvey: { surveyTitle: string; title: string; userId: number };
    answerStats: { questionId: number; answerText: string }[];
  }
> => {
  return useMutation<
    SurveyResponse,
    unknown,
    {
      endedSurvey: { surveyTitle: string; title: string; userId: number };
      answerStats: { questionId: number; answerText: string }[];
    }
  >({
    mutationFn: async (data) => {
      const res = await axiosInstance.post<SurveyResponse>('/endSurvey', data, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      return res.data;
    },
  });
};

const useToggleSurveyVisibilityMutation = (): UseMutationResult<
  { hidden: boolean },
  unknown,
  { surveyTitle: string; themeTitle: string }
> => {
  return useMutation<
    { hidden: boolean },
    unknown,
    { surveyTitle: string; themeTitle: string }
  >({
    mutationFn: async (data) => {
      const res = await axiosInstance.post<{ hidden: boolean }>(
        '/toggleVisible',
        data,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      );

      return res.data;
    },
  });
};

export {
  useToggleSurveyVisibilityMutation,
  useSubmitSurveyMutation,
  useGetQuestions,
  useAddSurveyMutation,
  useAddSurveyThemeMutation,
  useSurveyThemes,
  useLoginMutation,
  useRegistrationMutation,
  useLogoutMutation,
  refreshToken,
  useSurveysByTheme,
};
