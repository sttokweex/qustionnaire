import ApiError from '../exceptions/api-error.js';
import SurveyThemes from '../models/surveyThemes.js';
import Survey from '../models/survey.js';
import SurveyQuestions from '../models/surveyQuestions.js';
import AnswerOptions from '../models/answerOptions.js';
import EndedSurveys from '../models/endedSurveys.js';
import AnswerStats from '../models/answerStats.js';
import tokenService from '../service/token-service.js';

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

      const authHeader = request.headers.authorization;
      const token = authHeader.split(' ')[1];
      const userData = tokenService.validateAccessToken(token);

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

      const endedSurveys = await EndedSurveys.findAll({
        where: { userId: userData.id },
      });

      const endedSurveyIds = endedSurveys.map((survey) => survey.surveyId);

      const markedSurveys = surveys
        .map((survey) => {
          const surveyData = survey.get({ plain: true });
          const isUser = userData.role !== 'admin';

          if (surveyData.hidden && isUser) {
            return null;
          }

          return {
            ...surveyData,
            isCompleted: endedSurveyIds.includes(survey.id),
          };
        })
        .filter((survey) => survey !== null);

      return markedSurveys.length > 0
        ? markedSurveys
        : 'No available surveys for this user';
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
    const { survey, themeTitle, flag } = request.body;

    try {
      const theme = await SurveyThemes.findOne({
        where: { title: themeTitle },
      });

      const title = survey.title;

      const candidate = await Survey.findOne({
        where: { title: title },
      });

      if (candidate) {
        throw ApiError.BadRequest('Survey already exists');
      }

      const newSurvey = await Survey.create({
        themeId: theme.id,
        title: title,
        hidden: flag,
      });

      const newSurveyId = newSurvey.id;

      const questions = survey.questions;

      await Promise.all(
        questions.map(async (question) => {
          const { questionText, answerOptions, answerType } = question;

          const newQuestion = await SurveyQuestions.create({
            surveyId: newSurveyId,
            questionText: questionText,
            answerType: answerType,
          });

          if (answerOptions.length > 0) {
            await Promise.all(
              answerOptions.map(async (option) => {
                await AnswerOptions.create({
                  questionId: newQuestion.id,
                  answerText: option,
                });
              }),
            );
          }
        }),
      );

      return { title };
    } catch (e) {
      console.error(e);

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
  async submitSurvey(request) {
    const { answerStats, endedSurvey } = request.body;

    try {
      let surveyId;

      if (endedSurvey) {
        const { surveyTitle, userId } = endedSurvey;

        if (!surveyTitle || !userId) {
          throw ApiError.BadRequest('Заполните все поля для EndedSurveys');
        }

        const survey = await Survey.findOne({ where: { title: surveyTitle } });

        if (!survey) {
          throw ApiError.NotFound('Survey not found');
        }

        surveyId = survey.id;

        await EndedSurveys.create({
          surveyId,
          userId,
        });
      }

      if (Array.isArray(answerStats) && answerStats.length > 0) {
        for (const stat of answerStats) {
          const { questionId, answerText } = stat;

          if (!surveyId || !questionId || !answerText) {
            throw ApiError.BadRequest('Заполните все поля для AnswerStats');
          }

          const answersToProcess =
            typeof answerText === 'string'
              ? answerText.split(',').map((answer) => answer.trim())
              : [answerText];

          for (const answer of answersToProcess) {
            const existingStat = await AnswerStats.findOne({
              where: {
                surveyId,
                questionId,
                answerText: answer,
              },
            });

            if (existingStat) {
              existingStat.count += 1;

              await existingStat.save();
            } else {
              await AnswerStats.create({
                surveyId,
                questionId,
                answerText: answer,
                count: 1,
              });
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw ApiError.InternalServerError(
        'Ошибка сервера при обработке запроса',
      );
    }
  }
}

export default new questionareController();
