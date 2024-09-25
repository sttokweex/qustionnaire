import { DataTypes } from 'sequelize';
import sequelize from '../router/db-connector.js';
import Survey from './survey.js';
const SurveyQuestions = sequelize.define(
  'surveyQuestions',
  {
    surveyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Survey,
        key: 'id',
      },
    },
    questionText: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    answerType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);
export default SurveyQuestions;
