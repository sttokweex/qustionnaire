import ApiError from '../exceptions/api-error.js';
import tokenService from '../service/token-service.js';
export default async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const userData = tokenService.validateAccessToken(token);

    if (!authHeader || !token || !userData) {
      throw ApiError.UnauthorizedError();
    }
    req.user = userData;
    next();
  } catch (e) {
    throw ApiError.UnauthorizedError();
  }
};
