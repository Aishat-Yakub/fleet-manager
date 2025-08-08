import { User, UsersResponse } from '@/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface FetchOptions extends RequestInit {
  token?: string;
}

async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.token && { Authorization: `Bearer ${options.token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Something went wrong');
  }

  return response.json();
}

// User API functions
export const getUsers = async (page = 1, limit = 10, search = ''): Promise<UsersResponse> => {
  const query = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
  });
  
  return fetchApi<UsersResponse>(`/admin/users?${query.toString()}`);
};

export const updateUserStatus = async (userId: string, status: string, token?: string): Promise<User> => {
  return fetchApi<User>(`/admin/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
    token,
  });
};

export const deleteUser = async (userId: string, token?: string): Promise<void> => {
  return fetchApi<void>(`/admin/users/${userId}`, {
    method: 'DELETE',
    token,
  });
};
