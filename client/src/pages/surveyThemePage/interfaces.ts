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
}
