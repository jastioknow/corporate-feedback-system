export const API_URL = 'http://localhost:4000/api';

export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/auth/profile',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
} as const;

export const USER_ENDPOINTS = {
  PROFILE: '/profile',
} as const;
