import tokenService from '../service/token-service.js';
export default async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.code(401).send({ message: 'Пользователь не авторизован' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.code(401).send({ message: 'Пользователь не авторизован' });
    }
    const userData = tokenService.validateAccessToken(token);
    if (!userData) {
      return res.code(401).send({ message: 'Пользователь не авторизован' });
    }
    req.user = userData;
    next();
  } catch (e) {
    console.log(e);
    return res.code(401).send({ message: 'Пользователь не авторизован' });
  }
};
