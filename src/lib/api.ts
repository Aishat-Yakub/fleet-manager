import { User, UsersResponse } from '@/types/user';

// Get the API URL from environment variables with fallback to default
const getApiBaseUrl = (): string => {
  // In the browser, we use the public URL from environment variables
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'https://lasu-fleet.free.nf';
  }
  
  // On the server, we can also check for server-side environment variables
  return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://lasu-fleet.free.nf';
};

const API_BASE_URL = getApiBaseUrl();

// Log the API base URL in development for debugging
if (process.env.NODE_ENV === 'development') {
  console.log('Using API Base URL:', API_BASE_URL);
}

interface FetchOptions extends RequestInit {
  token?: string;
}

export async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  // Ensure endpoint starts with a slash
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.token && { Authorization: `Bearer ${options.token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${normalizedEndpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `HTTP error! status: ${response.status}`,
      }));
      
      const errorMessage = error?.message || `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
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
