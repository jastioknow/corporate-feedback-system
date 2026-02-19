import Cookies from 'js-cookie';

enum Token {
  ACCESS = 'access',
}

class TokenService {
  getAccessToken() {
    const accessToken = Cookies.get(Token.ACCESS);
    return accessToken ? accessToken : null;
  }

  saveAccessTokenStorage(accessToken: string) {
    Cookies.set(Token.ACCESS, accessToken, {
      expires: 1 / 24,
      // secure: false,
      sameSite: 'strict',
    });
  }

  removeAccessTokenStorage() {
    Cookies.remove(Token.ACCESS);
  }
}

export const tokenService = new TokenService();
