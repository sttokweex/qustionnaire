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
    initials: { type: DataTypes.STRING },
    gender: { type: DataTypes.STRING },
    birth_data: { type: DataTypes.DATE },
    indetificator: { type: DataTypes.STRING },
    snils: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    additional_info: { type: DataTypes.STRING },
  },
  {
    timestamps: false,
  },
);

export default Employe;
