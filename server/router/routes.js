import User from '../models/user.js';

import authController from '../controllers/authController.js';
import authMiddlewaree from '../middlewaree/auth-middlewaree.js';
import Employe from './../models/for-vki/emploey.js';
import GetRole from '../models/for-vki/get_role.js';
import GetPermissions from '../models/for-vki/get_permissions.js';
import GetPurpose from '../models/for-vki/get_purpose.js';
import Timeof from '../models/for-vki/timeof.js';
import Ban from '../models/for-vki/ban.js';

const routes = async (fastify) => {
  fastify.post('/registration', authController.registration);
  fastify.post('/login', authController.login);
  fastify.post('/logout', authController.logout);
  fastify.put('/archive', authController.archive)
  fastify.get('/refresh', authController.refresh);
  fastify.post('/update', async (request, reply) => {
    try {
      const { id, newData } = request.body; // Получение идентификатора и новых данных из запроса
      await Employe.update(newData, { where: { id: id } }); // Здесь YourModel - ваша модель Sequelize
      reply.send({ success: true, message: 'Данные успешно обновлены' });
    } catch (error) {
      reply.status(500).send({
        success: false,
        message: 'Произошла ошибка при обновлении данных',
      });
    }
  });
  fastify.get(
    '/users',
    {
      preHandler: authMiddlewaree,
    },
    async () => {
      const users = await User.findAll();
      return users;
    },
  );
  fastify.get('/employe', async () => {
    const Employees = await Employe.findAll();
    return Employees;
  });
  fastify.get('/employe/:id', async (request) => {
    const id = request.params.id;
    const role = await GetRole.findAll({ where: { user_id: id } });
    const permission = await GetPermissions.findAll({ where: { user_id: id } });
    const purpose = await GetPurpose.findAll({ where: { user_id: id } });
    const timeof = await Timeof.findAll({ where: { user_id: id } });
    const employe = await Employe.findOne({ where: { id: id } });
    const ban = await Ban.findAll({ where: { id: id } });
    return { employe, role, permission, purpose, timeof, ban };
  });
  fastify.get('/user/:id', async (request) => {
    const users = await User.findAll();
    const id = request.params.id;
    const user = users.find((user) => user.dataValues.id === +id);
    return user;
  });

  fastify.get('/', async function handler() {
    return { hello: 'world' };
  });
};

export default routes;
