import { Sequelize } from 'sequelize';
const sequelize = new Sequelize('postgres', 'postgres', 'admin', {
  host: 'localhost',
  dialect: 'postgres',
});
export default sequelize;
