import { DataTypes } from 'sequelize';
import sequelize from '../../router/db-connector.js';

const Employe = sequelize.define(
  'emploey',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    initials: { type: DataTypes.STRING, defaultValue: 'qwe' },
    gender: { type: DataTypes.STRING, defaultValue: 'qwe' },
    birth_data: { type: DataTypes.DATE, defaultValue: 123 },
    indetificator: { type: DataTypes.STRING, defaultValue: 'qwe' },
    snils: { type: DataTypes.STRING, defaultValue: 'qwe' },
    phone: { type: DataTypes.STRING, defaultValue: 'qwe' },
    email: { type: DataTypes.STRING, defaultValue: 'qwe' },
    additional_info: { type: DataTypes.STRING, defaultValue: 'qwe' },
    archive: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    timestamps: false,
  },
);

export default Employe;
