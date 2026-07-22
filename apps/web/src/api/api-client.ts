import { env } from '../config/env';
import { ApiError } from './api-error';

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type');

  if (response.status === 204) {
    return undefined;
  }

  if (contentType?.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body === undefined
        ? {}
        : {
            'Content-Type': 'application/json',
          }),
      ...options.headers,
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const responseBody = await parseResponseBody(response);

  if (!response.ok) {
    throw new ApiError(
      `API request failed with status ${response.status}`,
      response.status,
      responseBody,
    );
  }

  return responseBody as T;
}

export const apiClient = {
  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>(path, {
      ...options,
      method: 'GET',
    });
  },

  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(path, {
      ...options,
      method: 'POST',
      body,
    });
  },

  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(path, {
      ...options,
      method: 'PATCH',
      body,
    });
  },

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>(path, {
      ...options,
      method: 'DELETE',
    });
  },
};
