import { DataTypes } from 'sequelize';
import sequelize from '../../router/db-connector.js';
import Employe from './emploey.js';
import GetPurpose from './get_purpose.js';

const Timeof = sequelize.define(
  'timeof',
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
    purpose: {
      type: DataTypes.INTEGER,
      references: {
        model: GetPurpose,
        key: 'id',
      },
    },
    cause: { type: DataTypes.STRING, defaultValue: 'unluck' },
    date_from: { type: DataTypes.DATE, defaultValue: new Date() },
    date_to: { type: DataTypes.DATE, defaultValue: new Date('2055-01-01') },
  },
  {
    timestamps: false,
  },
);

export default Timeof;
