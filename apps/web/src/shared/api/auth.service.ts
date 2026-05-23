import { AuthResponse, LoginInput, RegisterInput } from '@corporate/types';
import { axiosClassic } from '../api/base';
import { tokenService } from '../lib/auth/token';
import { API_ENDPOINTS } from '../config/api';

const { AUTH } = API_ENDPOINTS;

class AuthService {
  async register(data: RegisterInput) {
    const response = await axiosClassic.post<AuthResponse>(AUTH.REGISTER, data);

    if (response?.data?.access) {
      tokenService.saveAccessTokenStorage(response.data.access);
    }
    return response;
  }

  async login(data: LoginInput) {
    const response = await axiosClassic.post<AuthResponse>(AUTH.LOGIN, data);

    if (response?.data?.access) {
      tokenService.saveAccessTokenStorage(response.data.access);
    }
    return response;
  }

  async logout() {
    const response = await axiosClassic.post(AUTH.LOGOUT);
    if (response?.status === 204) {
      tokenService.removeAccessTokenStorage();
    }
    return response;
  }

  async getNewTokens() {
    const response = await axiosClassic.post<AuthResponse>(AUTH.REFRESH);

    if (response?.data?.access) {
      tokenService.saveAccessTokenStorage(response.data.access);
    }
    return response;
  }
}

export const authService = new AuthService();
