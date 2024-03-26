import User from '../models/user.js';

import authController from '../controllers/authController.js';
import authMiddlewaree from '../middlewaree/auth-middlewaree.js';

const routes = async (fastify) => {
  fastify.post('/registration', authController.registration);
  fastify.post('/login', authController.login);
  fastify.post('/logout', authController.logout);
  fastify.get('/refresh', authController.refresh);
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
