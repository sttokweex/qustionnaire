import ApiError from '../exceptions/api-error.js';
import SurveyThemes from '../models/surveyThemes.js';
import Survey from '../models/survey.js';
import SurveyQuestions from '../models/surveyQuestions.js';
import AnswerOptions from '../models/answerOptions.js';

class questionareController {
  async getThemes() {
    try {
      const surveyThemes = await SurveyThemes.findAll();
      return surveyThemes;
    } catch (e) {
      throw ApiError.InternalServerError(
        'Error fetching themes from the database',
      );
    }
  }

  async getSurveys(request) {
    try {
      if (!request.body) {
        throw ApiError.BadRequest('Request body is missing');
      }

      const { title } = request.body;
      if (!title || typeof title !== 'string') {
        throw ApiError.BadRequest('Invalid title provided');
      }

      const theme = await SurveyThemes.findOne({ where: { title } });
      if (!theme) {
        throw ApiError.NotFound('Theme not found');
      }

      const themeId = theme.id;
      const surveys = await Survey.findAll({
        where: { themeId: Number(themeId) },
      });

      if (surveys.length === 0) {
        throw ApiError.NotFound('No surveys found for this theme');
      }

      return surveys;
    } catch (e) {
      if (e instanceof ApiError) {
        throw e;
      }
      throw ApiError.InternalServerError('Error fetching surveys');
    }
  }
  async addTheme(request) {
    const { title } = request.body;

    if (!title || typeof title !== 'string') {
      throw ApiError.BadRequest('Invalid title provided');
    }

    try {
      const candidate = await SurveyThemes.findOne({ where: { title } });
      if (candidate) {
        throw ApiError.BadRequest('Theme already exists');
      }

      await SurveyThemes.create({ title });
      return { title };
    } catch (e) {
      if (e.name === 'SequelizeValidationError') {
        throw ApiError.BadRequest(
          'Validation error: ' + e.errors.map((err) => err.message).join(', '),
        );
      }
      throw ApiError.InternalServerError('Error creating theme');
    }
  }
  async addSurvey(request) {
    const { title, themeTitle, flag } = request.body;
    console.log(title, themeTitle, flag);
    if (!title || typeof title !== 'string') {
      throw ApiError.BadRequest('Invalid title provided');
    }
    try {
      const theme = await SurveyThemes.findOne({
        where: { title: themeTitle },
      });
      console.log(theme);
      const candidate = await Survey.findOne({
        where: { title: title },
      });
      if (candidate) {
        throw ApiError.BadRequest('survey already exists');
      }

      await Survey.create({ themeId: theme.id, title: title, hidden: flag });
      return { title };
    } catch (e) {
      if (e.name === 'SequelizeValidationError') {
        throw ApiError.BadRequest(
          'Validation error: ' + e.errors.map((err) => err.message).join(', '),
        );
      }
      throw ApiError.InternalServerError('Error creating survey');
    }
  }
  async getQuestions(request) {
    const { title } = request.body;
    const survey = await Survey.findOne({ where: { title } });

    if (!survey) {
      throw ApiError.NotFound('Survey not found');
    }

    const surveyId = survey.id;
    const questions = await SurveyQuestions.findAll({
      where: { surveyId: Number(surveyId) },
    });

    const questionIds = questions.map((question) => question.id);

    const answers = await AnswerOptions.findAll({
      where: { questionId: questionIds },
    });

    return { survey, questions, answers };
  }
}

export default new questionareController();
