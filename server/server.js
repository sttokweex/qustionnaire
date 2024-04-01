import fastify from 'fastify';
import routes from './router/routes.js';
import sequelize from './router/db-connector.js';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';

const app = fastify();

(async () => {
  await sequelize.sync({});

  app.register(fastifyCors, {
    origin: 'http://localhost:5173',
    credentials: true,
  });
  app.register(fastifyCookie, {
    secret: 'your-secret-key',
  });

  app.register(routes);

  app.listen({ port: 3000 }, (err) => {
    if (err) {
      throw err;
    }
    console.log(`server listening on ${app.server.address().port}`);
  });
})();
