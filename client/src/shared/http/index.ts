import axios from 'axios';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from 'react-query';
import {
  AuthResponse,
  LoginData,
  Question,
  Survey,
  SurveyResponse,
  SurveyTheme,
} from '../interfaces';
import axiosInstance from '@/api/axiosInstance';

const API_URL: string = import.meta.env.VITE_DEV_PORT || '';

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
    console.log('Error refreshing token:', error);
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

  return useMutation(
    async (data: LoginData): Promise<AuthResponse> => {
      const res = await axiosInstance.post<AuthResponse>(`/login`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      return res.data;
    },
    {
      onSuccess: (response) => {
        queryClient.setQueryData('user', response.user);
        localStorage.setItem(
          'token',
          JSON.stringify({
            token: response.accessToken,
            exp: response.expirationTime,
          }),
        );

        console.log(queryClient.getQueryData('user'));
      },
    },
  );
};

const useRegistrationMutation = (): UseMutationResult<
  AuthResponse,
  unknown,
  LoginData
> => {
  const queryClient = useQueryClient();

  return useMutation(
    async (data: LoginData): Promise<AuthResponse> => {
      const res = await axiosInstance.post<AuthResponse>(
        `/registration`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        },
      );

      return res.data;
    },
    {
      onSuccess: (response) => {
        queryClient.setQueryData('user', response.user);

        localStorage.setItem(
          'token',
          JSON.stringify({
            token: response.accessToken,
            exp: response.expirationTime,
          }),
        );

        console.log(queryClient.getQueryData('user'));
      },
    },
  );
};

const useLogoutMutation = (
  refetchUserData: () => void,
): UseMutationResult<void, unknown, void, unknown> => {
  const queryClient = useQueryClient();

  return useMutation(
    (): Promise<void> => {
      return axiosInstance.post(`/logout`, null, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
    },
    {
      onSuccess: () => {
        queryClient.removeQueries('user');
        localStorage.clear();
        refetchUserData();
      },
    },
  );
};

const useSurveyThemes = () => {
  return useQuery<SurveyTheme[], Error>('surveyThemes', async () => {
    const response = await axios.get<SurveyTheme[]>(`${API_URL}/surveyThemes`, {
      withCredentials: true,
    });

    return response.data;
  });
};

const useSurveysByTheme = (title: string) => {
  return useQuery<Survey[], Error>(['surveys', title], async () => {
    const response = await axiosInstance.post<Survey[]>(
      `/surveys`,
      { title },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      },
    );

    return response.data;
  });
};
const useAddSurveyThemeMutation = (): UseMutationResult<
  SurveyTheme,
  unknown,
  { title: string },
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation(
    async (data: { title: string }): Promise<SurveyTheme> => {
      const res = await axiosInstance.post<SurveyTheme>(
        `/addSurveyTheme`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        },
      );

      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('surveyThemes');
      },
    },
  );
};
const useAddSurveyMutation = (): UseMutationResult<
  Survey,
  unknown,
  {
    survey: { title: string; questions: Question[] };
    themeTitle: string;
    flag: boolean;
  },
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation(
    async (data: {
      survey: { title: string; questions: Question[] };
      themeTitle: string;
      flag: boolean;
    }): Promise<Survey> => {
      const res = await axiosInstance.post<Survey>(`/addSurvey`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('survey');
      },
    },
  );
};
const useGetQuestions = (title: string) => {
  return useQuery<SurveyResponse, Error>(['surveys', title], async () => {
    const response = await axiosInstance.post<SurveyResponse>(
      `/survey`,
      { title },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      },
    );

    return response.data;
  });
};
const useSubmitSurveyMutation = (): UseMutationResult<
  SurveyResponse,
  unknown,
  {
    endedSurvey: { surveyTitle: string; userId: number };
    answerStats: {
      questionId: number;
      answerText: string;
    }[];
  },
  unknown
> => {
  return useMutation(
    async (data: {
      endedSurvey: { surveyTitle: string; userId: number };
      answerStats: {
        questionId: number;
        answerText: string;
      }[];
    }): Promise<SurveyResponse> => {
      const res = await axiosInstance.post<SurveyResponse>(`/endSurvey`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      return res.data;
    },
  );
};

export {
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
