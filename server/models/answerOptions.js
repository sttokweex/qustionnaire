import { DataTypes } from 'sequelize';
import sequelize from '../router/db-connector.js';
import SurveyQuestions from './surveyQuestions.js';
const AnswerOptions = sequelize.define(
  'answerOptions',
  {
    answerId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
export default AnswerOptions;
