import { DataTypes } from 'sequelize';
import sequelize from '../db-connector.js';
import SurveyQuestions from './surveyQuestions.js';
const AnswerOptions = sequelize.define(
  'answerOptions',
  {
    answer_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
export default AnswerOptions;
