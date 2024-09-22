import User from '../models/user.js';

import authController from '../controllers/authController.js';
import authMiddlewaree from '../middlewaree/auth-middlewaree.js';
import ApiError from '../exceptions/api-error.js';

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
    const id = request.params.id;
    const user = await User.findOne({ where: { id: +id } });
    if (!user) {
      throw ApiError.BadRequest('Пользователь не найден');
    }
    return user;
  });

  fastify.get('/', async function handler() {
    return { hello: 'world' };
  });
};

export default routes;
