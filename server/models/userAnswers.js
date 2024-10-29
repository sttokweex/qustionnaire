import { DataTypes } from 'sequelize';
import sequelize from '../db-connector.js';
import User from './user.js';
import SurveyQuestions from './surveyQuestions.js';
import Survey from './survey.js';

const UserAnswers = sequelize.define(
  'userAnswers',
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
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
export default UserAnswers;
