import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/widgets/header';
import { useAddSurveyMutation, useSurveysByTheme } from '@/shared/http';
import { Refetch } from '@/shared/types/interfaces';
import SurveyForm from './SurveyForm';
import SurveyList from './SurveyList';
import { UserData } from '@/entity/user';

interface SurveyThemePageProps {
  userData: UserData;
  refetch: Refetch;
}
interface Question {
  questionText: string;
  answerOptions: string;
  answerType: string;
}
interface Survey {
  questions: Question[];
  title: string;
  flag: string;
}
const SurveyThemePage: React.FC<SurveyThemePageProps> = ({
  userData,
  refetch,
}) => {
  const navigate = useNavigate();
  const addSurveyMutation = useAddSurveyMutation();
  const { title } = useParams<{ title: string }>();

  if (!title) {
    return <div>Error: title is missing in the URL.</div>;
  }

  const {
    data: surveys = [],
    isLoading,
    refetch: refetchThemes,
  } = useSurveysByTheme(title);

  useEffect(() => {
    refetchThemes();
  }, [title, refetchThemes]);

  const onSubmit = async (data: Survey) => {
    console.log(data, data.questions[0]);
    const isPrivate = data.flag === 'private';
    const formData = {
      survey: {
        title: data.title,
        questions: data.questions.map((question: Question) => ({
          questionText: question.questionText,
          answerOptions: question.answerOptions
            .split(',')
            .map((option: string) => option.trim())
            .filter((option: string) => option),
          answerType: question.answerType,
        })),
      },
      themeTitle: title,
      flag: isPrivate,
    };

    try {
      await addSurveyMutation.mutateAsync(formData);
      refetchThemes();
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error adding the survey.',
      );
    }
  };

  return (
    <div className="h-screen w-full bg-gray-50">
      <Header username={userData.username} onRefetch={refetch} />
      <div className="p-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Back to Themes
        </button>
      </div>
      {isLoading && (
        <div className="text-gray-600 text-center">Loading surveys...</div>
      )}
      {userData.role === 'admin' && (
        <div className="add-survey-section my-6 p-4 bg-white rounded-lg shadow md:my-8">
          <SurveyForm onSubmit={onSubmit} />
        </div>
      )}
      <h1 className="text-3xl font-bold text-center mb-4 text-purple-800">
        Surveys for the Theme: {title}
      </h1>
      <SurveyList
        surveys={surveys}
        themeTitle={title}
        isAdmin={userData.role == 'admin'}
      />
    </div>
  );
};

export default SurveyThemePage;
