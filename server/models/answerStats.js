import { DataTypes } from 'sequelize';
import sequelize from '../router/db-connector.js';
import SurveyQuestions from './surveyQuestions.js';
import Survey from './survey.js';

const AnswerStats = sequelize.define(
  'answerStats',
  {
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    surveyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Survey,
        key: 'id',
      },
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: SurveyQuestions,
        key: 'id',
      },
    },
    answerText: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);
export default AnswerStats;
