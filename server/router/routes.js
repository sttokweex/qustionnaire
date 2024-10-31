import authController from '../controllers/authController.js';
import authMiddlewaree from '../middlewaree/auth-middlewaree.js';
import questionareController from '../controllers/questionareController.js';

const routes = async (fastify) => {
  fastify.post('/registration', authController.registration);
  fastify.post('/login', authController.login);
  fastify.post('/logout', authController.logout);
  fastify.get('/refresh', authController.refresh);
  fastify.post('/survey', questionareController.getQuestions);
  fastify.post('/addSurveyTheme', questionareController.addTheme);
  fastify.post('/addSurvey', questionareController.addSurvey);
  fastify.post('/endSurvey', questionareController.submitSurvey);
  fastify.post('/toggleVisible', questionareController.toggleSurveyVisibility);
  fastify.post(
    '/surveys',
    {
      preHandler: authMiddlewaree,
    },
    questionareController.getSurveys,
  );

  fastify.get('/surveyThemes', questionareController.getThemes);
};

export default routes;
