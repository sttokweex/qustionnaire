/* eslint-disable no-undef */

import fastify from 'fastify';
import routes from './router/routes.js';
import sequelize from './router/db-connector.js';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';

const app = fastify();
(async () => {
  await sequelize.sync();

  app.register(fastifyCors, {
    origin: 'http://localhost',
    credentials: true,
  });
  app.register(fastifyCookie, {
    secret: 'your-secret-key',
  });

  app.register(routes);

  app.listen({ port: 3000, host: '0.0.0.0' }, (err) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    console.log(`server listening on ${app.server.address().port}`);
  });
})();
