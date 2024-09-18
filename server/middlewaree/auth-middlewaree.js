import ApiError from '../exceptions/api-error.js';
import tokenService from '../service/token-service.js';
export default async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw ApiError.UnauthorizedError();
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateAccessToken(token);
    if (!userData) {
      throw ApiError.UnauthorizedError();
    }
    req.user = userData;
    next();
  } catch (e) {
    throw ApiError.UnauthorizedError();
  }
};
