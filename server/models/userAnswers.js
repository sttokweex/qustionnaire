import { DataTypes } from 'sequelize';
import sequelize from '../db-connector.js';
import User from './user.js';
import SurveyQuestions from './surveyQuestions.js';
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
