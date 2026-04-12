import { apiRequest } from './client';

export function fetchDashboardStats() {
  return apiRequest('/fatwas/stats/summary');
}
