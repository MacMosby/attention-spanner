import { apiClient } from '../../../api/api-client';

export type HealthResponse = {
  status: 'ok';
};

export function getHealth(): Promise<HealthResponse> {
  return apiClient.get<HealthResponse>('/health');
}
