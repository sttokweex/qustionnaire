import { DataTypes } from 'sequelize';
import sequelize from '../router/db-connector.js';
import User from './user.js';
const Token = sequelize.define(
  'token',
  {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
    refresh: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);
export default Token;
