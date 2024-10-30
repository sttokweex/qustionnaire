import User from '../models/user.js';
import authController from '../controllers/authController.js';
import authMiddlewaree from '../middlewaree/auth-middlewaree.js';
import ApiError from '../exceptions/api-error.js';
import questionareController from '../controllers/questionareController.js';

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
  fastify.post('/survey', questionareController.getQuestions);
  fastify.get('/surveyThemes', questionareController.getThemes);
  fastify.post(
    '/surveys',
    {
      preHandler: authMiddlewaree,
    },
    questionareController.getSurveys,
  );
  fastify.post('/addSurveyTheme', questionareController.addTheme);
  fastify.post('/addSurvey', questionareController.addSurvey);
  fastify.post('/endSurvey', questionareController.submitSurvey);
  fastify.post('/toggleVisible', questionareController.toggleSurveyVisibility);
  fastify.get('/', async function handler() {
    return { hello: 'world' };
  });
};

export default routes;
