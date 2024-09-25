import { DataTypes } from 'sequelize';
import sequelize from '../router/db-connector.js';
import User from './user.js';

const Survey = sequelize.define(
  'survey',
  {
    themeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    hidden: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: false,
  },
);

export default Survey;
