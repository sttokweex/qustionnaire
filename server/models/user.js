import { DataTypes } from 'sequelize';
import sequelize from '../router/db-connector.js';

const User = sequelize.define(
  'users',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    role: { type: DataTypes.STRING, defaultValue: 'user' },
  },
  {
    timestamps: false,
  },
);
export default User;
