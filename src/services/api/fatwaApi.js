import { apiRequest } from './client';

export function fetchFatwas({ admin = false } = {}) {
  const query = admin ? '' : '';
  return apiRequest(`/fatwas${query}`);
}

export function fetchFatwaById(id) {
  return apiRequest(`/fatwas/${id}`);
}

export function submitFatwa(payload) {
  return apiRequest('/fatwas', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateFatwa(id, payload) {
  return apiRequest(`/fatwas/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function removeFatwa(id) {
  return apiRequest(`/fatwas/${id}`, {
    method: 'DELETE',
  });
}
