import User from '../models/user.js';
import bcrypt from 'bcrypt';
import tokenService from '../service/token-service.js';
class authController {
  async registration(request, reply) {
    try {
      const { username, password } = request.body;
      if (password.length < 5 || password.length > 10) {
        return reply
          .code(400)
          .send('Password must be between 5 and 10 characters');
      }
      const candidate = await User.findOne({ where: { username: username } });
      if (candidate) {
        return reply.code(400).send(`unluck ${candidate.username} уже есть`);
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
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return {
        ...tokens,
      };
    } catch (e) {
      console.log(e);
    }
  }
  async login(request, reply) {
    try {
      const { username, password } = request.body;
      const user = await User.findOne({ where: { username: username } });
      if (!user) {
        return reply
          .code(400)
          .send({ message: `Пользователь ${username} не найден` });
      }

      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return reply.code(400).send({ message: `Введен неверный пароль` });
      }
      const tokens = tokenService.generateTokens({
        id: user.id,
        role: user.role,
        username: user.username,
      });

      await tokenService.saveToken(user.id, tokens.refreshToken);

      reply.setCookie('refreshToken', tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
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
      reply.code(400).send({ message: 'Login error' });
    }
  }
  async logout(request, reply) {
    try {
      const { refreshToken } = request.cookies;
      const token = await tokenService.removeToken(refreshToken);
      reply.clearCookie('refreshToken');
      return { token };
    } catch (e) {
      reply.code(400).send(e);
    }
  }
  async refresh(request, reply) {
    try {
      const { refreshToken } = request.cookies;
      if (!refreshToken) {
        return reply.code(403).send({ message: 'Пользователь не авторизован' });
      }
      const userData = tokenService.validateRefreshToken(refreshToken);
      const tokenFromDb = await tokenService.findToken(refreshToken);
      if (!userData || !tokenFromDb) {
        return reply.code(403).send({ message: 'Пользователь не авторизован' });
      }
      const user = await User.findOne({ where: { id: userData.id } });
      const tokens = tokenService.generateTokens({
        id: user.id,
        role: user.role,
        username: user.username,
      });
      await tokenService.saveToken(user.id, tokens.refreshToken);
      reply.setCookie('refreshToken', tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return {
        ...tokens,
      };
    } catch (e) {
      reply.code(400).send(e);
    }
  }
}
export default new authController();
