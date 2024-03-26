import { DataTypes } from 'sequelize';
import sequelize from '../db-connector.js';
import User from './user.js';

const Survey = sequelize.define(
  'survey',
  {
    theme_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    admin_id: {
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
