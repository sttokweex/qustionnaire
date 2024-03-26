import jwt from 'jsonwebtoken';
import secret from '../config.js';
import Token from '../models/token.js';
class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, secret.access_secret, {
      expiresIn: '10m',
    });
    const refreshToken = jwt.sign(payload, secret.refresh_secret, {
      expiresIn: '30d',
    });
    return { accessToken, refreshToken };
  }
  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, secret.access_secret);
      return userData;
    } catch (e) {
      return null;
    }
  }
  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, secret.refresh_secret);
      return userData;
    } catch (e) {
      return null;
    }
  }
  async saveToken(userId, refreshToken) {
    const tokenData = await Token.findOne({ where: { user_id: userId } });
    if (tokenData) {
      tokenData.refresh = refreshToken;
      return tokenData.save();
    }
    const token = await Token.create({
      user_id: userId,
      refresh: refreshToken,
    });
    return token;
  }
  async removeToken(refreshToken) {
    const tokenData = await Token.destroy({
      where: { refresh: refreshToken },
    });
    return tokenData;
  }
  async findToken(refreshToken) {
    const tokenData = await Token.findOne({
      where: { refresh: refreshToken },
    });
    return tokenData;
  }
}
export default new TokenService();
