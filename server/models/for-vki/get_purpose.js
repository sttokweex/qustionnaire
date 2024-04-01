import { DataTypes } from 'sequelize';
import sequelize from '../../router/db-connector.js';

import Employe from './emploey.js';

const GetPurpose = sequelize.define(
  'get_purpose',
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

    purpose: { type: DataTypes.STRING, defaultValue: 'main' },
    employer: { type: DataTypes.STRING, defaultValue: 'вован' },
    position: { type: DataTypes.STRING, defaultValue: 'крутой' },
    cabinet: { type: DataTypes.STRING, defaultValue: '202' },
    organization: { type: DataTypes.STRING, defaultValue: 'мая' },
    date_from: { type: DataTypes.DATE, defaultValue: new Date() },
    date_to: { type: DataTypes.DATE, defaultValue: new Date('2055-01-01') },
  },
  {
    timestamps: false,
  },
);

export default GetPurpose;
