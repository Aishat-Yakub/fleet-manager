import { User, UsersResponse } from '@/types/user';
import { fetchApi } from '@/lib/api';

export const userService = {
  // Get all users with pagination
  async getUsers(page: number = 1, limit: number = 10): Promise<UsersResponse> {
    return fetchApi<UsersResponse>(`/admin/users?page=${page}&limit=${limit}`);
  },

  // Create a new user
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return fetchApi<User>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Update user status
  async updateUserStatus(userId: string, status: 'active' | 'inactive' | 'suspended'): Promise<User> {
    return fetchApi<User>(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Delete a user
  async deleteUser(userId: string): Promise<void> {
    await fetchApi(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }
};
