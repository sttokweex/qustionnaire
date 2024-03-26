import { DataTypes } from 'sequelize';
import sequelize from '../db-connector.js';
import Survey from './survey.js';
const SurveyQuestions = sequelize.define(
  'surveyQuestions',
  {
    survey_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Survey, // Модель, с которой устанавливается связь
        key: 'id', // Поле, на которое устанавливается связь
      },
    },
    question_text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    answer_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);
export default SurveyQuestions;
