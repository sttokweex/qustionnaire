import { DataTypes } from 'sequelize';
import sequelize from '../../router/db-connector.js';
import Employe from './emploey.js';

const Ban = sequelize.define(
  'ban',
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
    schedule: { type: DataTypes.STRING, defaultValue: 'сегодня-завтра' },
    ip_ban: { type: DataTypes.BOOLEAN, defaultValue: false },
    date_from: { type: DataTypes.DATE, defaultValue: new Date() },
    date_to: { type: DataTypes.DATE, defaultValue: new Date('2055-01-01') },
  },
  {
    timestamps: false,
  },
);

export default Ban;
