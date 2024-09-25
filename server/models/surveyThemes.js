import { DataTypes } from 'sequelize';
import sequelize from '../router/db-connector.js';
const SurveyThemes = sequelize.define(
  'surveytheme',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);
export default SurveyThemes;
