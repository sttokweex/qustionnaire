import { DataTypes } from 'sequelize';
import sequelize from '../db-connector.js';
import Survey from './survey.js';
import User from './user.js';
import SurveyQuestions from './surveyQuestions.js';
const UserAnswers = sequelize.define(
  'userAnswers',
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    survey_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Survey,
        key: 'id',
      },
    },
    question_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: SurveyQuestions,
        key: 'id',
      },
    },
    answer_text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);
export default UserAnswers;
