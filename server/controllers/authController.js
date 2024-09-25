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
          'Password must be more than 5 characters and less than 10',
        );
      }

      const candidate = await User.findOne({ where: { username } });
      if (candidate) {
        throw ApiError.BadRequest('User already exists');
      }

      const hashPassword = bcrypt.hashSync(password, 8);
      const user = await User.create({
        username,
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
      console.error(e);
      reply.status(e.status || 500).send({
        message: e.message || 'Registration error',
      });
    }
  }

  async login(request, reply) {
    try {
      const { username, password } = request.body;

      const user = await User.findOne({ where: { username } });
      if (!user) {
        throw ApiError.BadRequest('User not found');
      }

      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        throw ApiError.BadRequest('Invalid password');
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
      console.error(e);
      reply.status(e.status || 500).send({
        message: e.message || 'Login error',
      });
    }
  }

  async logout(request, reply) {
    try {
      const { refreshToken } = request.cookies;
      if (!refreshToken) {
        throw ApiError.BadRequest('Token not found');
      }

      await tokenService.removeToken(refreshToken);
      reply.clearCookie('refreshToken');
      return { message: 'Successfully logged out' };
    } catch (e) {
      console.error(e);
      reply.status(400).send({ message: 'Logout error' });
    }
  }

  async refresh(request, reply) {
    try {
      const { refreshToken } = request.cookies;
      if (!refreshToken) {
        throw ApiError.UnauthorizedError('Unauthorized');
      }

      const userData = tokenService.validateRefreshToken(refreshToken);
      const tokenFromDb = await tokenService.findToken(refreshToken);
      if (!userData || !tokenFromDb) {
        await tokenService.removeToken(refreshToken);
        throw ApiError.UnauthorizedError('Unauthorized');
      }

      const user = await User.findOne({ where: { id: userData.id } });
      if (!user) {
        throw ApiError.UnauthorizedError('User not found');
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
      console.error(e);
      reply.status(e.status || 500).send({
        message: e.message || 'Token refresh error',
      });
    }
  }
}

export default new authController();
