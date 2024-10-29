// components/SurveyResults.tsx
import React from 'react';
import './styles.css'; // Импорт стилей
import { SurveyResultsProps } from './interfaces';

const SurveyResults: React.FC<SurveyResultsProps> = ({ results, onSend }) => {
  return (
    <div className="results">
      <h2>Результаты опроса в формате JSON:</h2>
      <pre>{JSON.stringify(results, null, 2)}</pre>
      <button onClick={onSend}>Отправить результаты</button>
    </div>
  );
};

export default SurveyResults;
