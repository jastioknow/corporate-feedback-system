import { AuthResponse, LoginInput, RegisterInput } from '@corporate/types';
import { axiosClassic } from '../api/base';
import { tokenService } from '../lib/auth/token';
import { AUTH_ENDPOINTS } from '../config/api';

class AuthService {
  async register(data: RegisterInput) {
    const response = await axiosClassic.post<AuthResponse>(AUTH_ENDPOINTS.REGISTER, data);

    if (response?.data?.access) {
      tokenService.saveAccessTokenStorage(response.data.access);
    }
    return response;
  }

  async login(data: LoginInput) {
    const response = await axiosClassic.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, data);

    if (response?.data?.access) {
      tokenService.saveAccessTokenStorage(response.data.access);
    }
    return response;
  }

  async logout() {
    const response = await axiosClassic.post(AUTH_ENDPOINTS.LOGOUT);
    if (response?.status === 204) {
      tokenService.removeAccessTokenStorage();
    }
    return response;
  }

  async getNewTokens() {
    const response = await axiosClassic.post<AuthResponse>(AUTH_ENDPOINTS.REFRESH);

    if (response?.data?.access) {
      tokenService.saveAccessTokenStorage(response.data.access);
    }
    return response;
  }
}

export const authService = new AuthService();
