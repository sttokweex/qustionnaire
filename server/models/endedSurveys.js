import { DataTypes } from 'sequelize';
import sequelize from '../router/db-connector.js';
import Survey from './survey.js';
import User from './user.js';

const EndedSurveys = sequelize.define(
  'endedSurveys',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    timestamps: false,
  },
);
export default EndedSurveys;
