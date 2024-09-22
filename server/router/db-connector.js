import { Sequelize } from 'sequelize';
const sequelize = new Sequelize('postgres', 'postgres', 'admin', {
  host: 'some-postgres', // имя сервиса
  dialect: 'postgres',
});

export default sequelize;
