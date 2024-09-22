import User from '../models/user.js';
import bcrypt from 'bcrypt';
import tokenService from '../service/token-service.js';
import ApiError from '../exceptions/api-error.js';
import secret from '../config.js';
class authController {
  async registration(request, reply) {
    try {
      const { username, password } = request.body;
      if (password.length < 5 || password.length > 10) {
        throw ApiError.BadRequest(
          'Пароль должен быть больше 5 символов и меньше 10',
        );
      }
      const candidate = await User.findOne({ where: { username: username } });
      if (candidate) {
        throw ApiError.BadRequest('Пользователь уже существует');
      }
      const hashPassword = bcrypt.hashSync(password, 8);
      const user = await User.create({
        username: username,
        password: hashPassword,
        role: 'user',
      });
      const tokens = tokenService.generateTokens({
        id: user.id,
        role: user.role,
        username: user.username,
      });
      await tokenService.saveToken(user.id, tokens.refreshToken);
      reply.setCookie('refreshToken', tokens.refreshToken, {
        maxAge: secret.cookie_max_age,
        httpOnly: true,
      });
      return {
        ...tokens,
        user: {
          id: user.id,
          role: user.role,
          username: user.username,
        },
      };
    } catch (e) {
      console.log(e);
      reply.status(e.status || 500).send({
        message: e.message || 'Ошибка регистрации',
      });
    }
  }

  async login(request, reply) {
    try {
      const { username, password } = request.body;
      const user = await User.findOne({ where: { username: username } });
      if (!user) {
        throw ApiError.BadRequest('Пользователь не найден');
      }

      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        throw ApiError.BadRequest('Введен неверный пароль');
      }
      const tokens = tokenService.generateTokens({
        id: user.id,
        role: user.role,
        username: user.username,
      });

      await tokenService.saveToken(user.id, tokens.refreshToken);
      reply.setCookie('refreshToken', tokens.refreshToken, {
        maxAge: secret.cookie_max_age,
        httpOnly: true,
      });

      return {
        ...tokens,
        user: {
          id: user.id,
          role: user.role,
          username: user.username,
        },
      };
    } catch (e) {
      console.log(e);
      reply.status(e.status || 500).send({
        message: e.message || 'Ошибка входа',
      });
    }
  }

  async logout(request, reply) {
    try {
      const { refreshToken } = request.cookies;
      const token = await tokenService.removeToken(refreshToken);
      reply.clearCookie('refreshToken');
      return { token };
    } catch (e) {
      console.log(e);
      reply.status(400).send({ message: 'Ошибка выхода' });
    }
  }

  async refresh(request, reply) {
    try {
      const { refreshToken } = request.cookies;
      if (!refreshToken) {
        throw ApiError.UnauthorizedError('Не авторизован');
      }
      const userData = tokenService.validateRefreshToken(refreshToken);
      const tokenFromDb = await tokenService.findToken(refreshToken);
      if (!userData || !tokenFromDb) {
        throw ApiError.UnauthorizedError('Не авторизован');
      }
      const user = await User.findOne({ where: { id: userData.id } });
      const tokens = tokenService.generateTokens({
        id: user.id,
        role: user.role,
        username: user.username,
      });

      await tokenService.saveToken(user.id, tokens.refreshToken);
      reply.setCookie('refreshToken', tokens.refreshToken, {
        maxAge: secret.cookie_max_age,
        httpOnly: true,
      });

      return {
        ...tokens,
        user: {
          id: user.id,
          role: user.role,
          username: user.username,
        },
      };
    } catch (e) {
      console.log(e);
      reply.status(e.status || 500).send({
        message: e.message || 'Ошибка обновления токена',
      });
    }
  }
}

export default new authController();
