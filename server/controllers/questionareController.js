import ApiError from '../exceptions/api-error.js';
import SurveyThemes from '../models/surveyThemes.js';
import Survey from '../models/survey.js';
import SurveyQuestions from '../models/surveyQuestions.js';
import AnswerOptions from '../models/answerOptions.js';
import EndedSurveys from '../models/endedSurveys.js';
import AnswerStats from '../models/answerStats.js';
import tokenService from '../service/token-service.js';

class QuestionareController {
  getThemes = async () => {
    try {
      const surveyThemes = await SurveyThemes.findAll();

      return surveyThemes;
    } catch (e) {
      throw ApiError.InternalServerError(
        'Error fetching themes from the database',
      );
    }
  };

  getSurveys = async (request) => {
    try {
      const { title } = this.validateRequestBody(request.body, ['title']);

      const authHeader = request.headers.authorization;
      const token = authHeader.split(' ')[1];
      const userData = tokenService.validateAccessToken(token);

      const theme = await SurveyThemes.findOne({ where: { title } });

      if (!theme) throw ApiError.NotFound('Theme not found');

      const surveys = await Survey.findAll({ where: { themeId: theme.id } });

      if (surveys.length === 0) {
        throw ApiError.NotFound('No surveys found for this theme');
      }

      const endedSurveys = await EndedSurveys.findAll({
        where: { userId: userData.id },
      });
      const endedSurveyIds = endedSurveys.map((survey) => survey.surveyId);

      return surveys
        .filter((survey) => {
          const isUser = userData.role !== 'admin';

          return !survey.hidden || !isUser;
        })
        .map((survey) => ({
          ...survey.get({ plain: true }),
          isCompleted: endedSurveyIds.includes(survey.id),
        }));
    } catch (e) {
      if (e instanceof ApiError) {
        throw e;
      }

      throw ApiError.InternalServerError(
        'Error fetching surveys from the database',
      );
    }
  };

  addTheme = async (request, reply) => {
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

      return reply.status(201).send({ title });
    } catch (e) {
      if (e.name === 'SequelizeValidationError') {
        return reply.status(400).send({
          message:
            'Validation error: ' +
            e.errors.map((err) => err.message).join(', '),
        });
      }

      if (e instanceof ApiError) {
        return reply.status(e.statusCode || 500).send({ message: e.message });
      }

      return reply.status(500).send({ message: 'Error creating survey' });
    }
  };

  addSurvey = async (request, reply) => {
    const { survey, themeTitle, flag } = request.body;

    try {
      // Проверяем, есть ли хотя бы один вопрос
      if (!survey.questions || survey.questions.length === 0) {
        throw ApiError.BadRequest(
          'At least one question is required in the survey.',
        );
      }

      const theme = await SurveyThemes.findOne({
        where: { title: themeTitle },
      });

      if (!theme) throw ApiError.BadRequest('Theme not found');

      const candidate = await Survey.findOne({
        where: { title: survey.title, themeId: theme.id },
      });

      if (candidate) {
        throw ApiError.BadRequest('Survey already exists in this theme');
      }

      // Проверяем каждый вопрос на наличие текста и вариантов ответа
      survey.questions.forEach((question) => {
        if (
          !question.questionText ||
          typeof question.questionText !== 'string' ||
          question.questionText.trim() === ''
        ) {
          throw ApiError.BadRequest(
            'Each question must have valid question text.',
          );
        }

        if (
          (question.answerType === 'single' ||
            question.answerType === 'multiple') &&
          (!question.answerOptions || question.answerOptions.length === 0)
        ) {
          throw ApiError.BadRequest(
            'Answer options are required for single or multiple choice questions.',
          );
        }
      });

      const newSurvey = await Survey.create({
        themeId: theme.id,
        title: survey.title,
        hidden: flag,
      });

      await Promise.all(
        survey.questions.map(async (question) => {
          const newQuestion = await SurveyQuestions.create({
            surveyId: newSurvey.id,
            questionText: question.questionText,
            answerType: question.answerType,
          });

          if (question.answerOptions && question.answerOptions.length > 0) {
            await Promise.all(
              question.answerOptions.map(async (option) =>
                AnswerOptions.create({
                  questionId: newQuestion.id,
                  answerText: option,
                }),
              ),
            );
          }
        }),
      );

      return reply.status(201).send({ title: survey.title });
    } catch (e) {
      if (e.name === 'SequelizeValidationError') {
        return reply.status(400).send({
          message:
            'Validation error: ' +
            e.errors.map((err) => err.message).join(', '),
        });
      }

      if (e instanceof ApiError) {
        return reply.status(e.statusCode || 500).send({ message: e.message });
      }

      return reply.status(500).send({ message: 'Error creating survey' });
    }
  };

  getQuestions = async (request) => {
    const { title } = request.body;

    const survey = await Survey.findOne({ where: { title } });

    if (!survey) throw ApiError.NotFound('Survey not found');

    const questions = await SurveyQuestions.findAll({
      where: { surveyId: survey.id },
    });
    const questionIds = questions.map((question) => question.id);

    const answers = await AnswerOptions.findAll({
      where: { questionId: questionIds },
    });

    return { survey, questions, answers };
  };

  submitSurvey = async (request) => {
    const { answerStats, endedSurvey } = request.body;

    try {
      let surveyId;

      if (endedSurvey) {
        const { surveyTitle, title, userId } = endedSurvey;

        if (!surveyTitle || !userId || !title) {
          throw ApiError.BadRequest(
            'All fields for EndedSurveys must be filled',
          );
        }
        const surveyTheme = await SurveyThemes.findOne({ where: { title } });

        if (!surveyTheme) {
          throw ApiError.NotFound('SurveyTheme not found');
        }
        const survey = await Survey.findOne({
          where: { title: surveyTitle, themeId: surveyTheme.id },
        });

        if (!survey) {
          throw ApiError.NotFound('Survey not found');
        }

        surveyId = survey.id;
        await EndedSurveys.create({ surveyId, userId });
      }

      if (Array.isArray(answerStats) && answerStats.length > 0) {
        await Promise.all(
          answerStats.map(async (stat) => {
            const { questionId, answerText } = stat;

            if (!surveyId || !questionId || !answerText) {
              throw ApiError.BadRequest(
                'All fields for AnswerStats must be filled',
              );
            }
            const answersToProcess =
              typeof answerText === 'string'
                ? answerText.split(',').map((answer) => answer.trim())
                : [answerText];

            await Promise.all(
              answersToProcess.map(async (answer) => {
                const existingStat = await AnswerStats.findOne({
                  where: { surveyId, questionId, answerText: answer },
                });

                if (existingStat) {
                  existingStat.count += 1;
                  await existingStat.save();
                } else {
                  await AnswerStats.create({
                    surveyId,
                    questionId,
                    answerText,
                    count: 1,
                  });
                }
              }),
            );
          }),
        );
      }

      return { message: 'Survey submitted successfully' };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw ApiError.InternalServerError(
        'Internal server error while processing request',
      );
    }
  };
  toggleSurveyVisibility = async (request, reply) => {
    const { surveyTitle, themeTitle } = request.body;

    if (!surveyTitle) {
      throw ApiError.BadRequest('Survey is required');
    }
    try {
      const theme = await SurveyThemes.findOne({
        where: { title: themeTitle },
      });
      const survey = await Survey.findOne({
        where: { title: surveyTitle, themeId: theme.id },
      });

      if (!survey) {
        throw ApiError.NotFound('Survey not found');
      }

      survey.hidden = !survey.hidden;
      await survey.save();

      return reply
        .status(200)
        .send({ message: 'Survey visibility updated', hidden: survey.hidden });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw ApiError.InternalServerError(
        'Internal server error while processing request',
      );
    }
  };
  validateRequestBody = (body, requiredFields) => {
    if (!body) {
      throw ApiError.BadRequest('Request body is missing');
    }

    for (const field of requiredFields) {
      if (!body[field] || typeof body[field] !== 'string') {
        throw ApiError.BadRequest(`Invalid or missing ${field} provided`);
      }
    }

    return body;
  };
}

export default new QuestionareController();
