export interface Question {
  questionText: string;
  answerOptions: string;
  answerType: 'single' | 'multiple' | 'open';
}

export interface SurveyFormData {
  title: string;
  flag: 'private' | 'public';
  questions: Question[];
}
