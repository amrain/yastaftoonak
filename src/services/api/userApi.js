import { apiRequest } from './client';

export function fetchUsers() {
  return apiRequest('/users');
}

export function createUser(payload) {
  return apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateUser(id, payload) {
  return apiRequest(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function removeUser(id) {
  return apiRequest(`/users/${id}`, {
    method: 'DELETE',
  });
}
