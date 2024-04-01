import { DataTypes } from 'sequelize';
import sequelize from '../../router/db-connector.js';

import Employe from './emploey.js';

const GetRole = sequelize.define(
  'get_role',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Employe,
        key: 'id',
      },
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_from: { type: DataTypes.DATE, defaultValue: new Date() },
    date_to: { type: DataTypes.DATE },
  },
  {
    timestamps: false,
  },
);

export default GetRole;
