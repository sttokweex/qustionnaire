import React from 'react';
import { SurveyResultsProps } from './interfaces';

const SurveyResults: React.FC<SurveyResultsProps> = ({
  results,
  onSend,
  onBack,
}) => {
  return (
    <div className="results p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Survey Results in JSON format:
      </h2>
      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
        {JSON.stringify(results, null, 2)}
      </pre>
      <div className="flex justify-between mt-4">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition duration-300"
        >
          Back to Questions
        </button>
        <button
          onClick={onSend}
          className="ml-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Send Results
        </button>
      </div>
    </div>
  );
};

export default SurveyResults;
