import { DataTypes } from 'sequelize';
import sequelize from '../router/db-connector.js';
import SurveyQuestions from './surveyQuestions.js';
const AnswerOptions = sequelize.define(
  'answerOptions',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
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
