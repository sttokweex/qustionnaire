import { Survey } from '../../interfaces';

export interface SurveyListProps {
  surveys: Survey[];
  themeTitle: string;
  isAdmin: boolean; // Добавьте пропс для роли админа
}
