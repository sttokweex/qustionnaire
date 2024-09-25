import ApiError from '../exceptions/api-error.js';
import SurveyThemes from '../models/surveyThemes.js';
import Survey from '../models/survey.js';

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
}

export default new questionareController();
