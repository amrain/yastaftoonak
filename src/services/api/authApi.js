import { apiRequest } from './client';

export function loginRequest(credentials) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export function getCurrentUser(token) {
  return apiRequest('/auth/me', { token });
}
