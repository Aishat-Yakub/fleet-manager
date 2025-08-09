import axios from 'axios';
import { User, UsersResponse } from '@/types/user';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const userService = {
  // Get all users with pagination
  async getUsers(page: number = 1, limit: number = 10): Promise<UsersResponse> {
    const response = await axios.get(`${API_URL}/admin/users?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Create a new user
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const response = await axios.post(`${API_URL}/admin/users`, userData);
    return response.data;
  },

  // Update user status
  async updateUserStatus(userId: string, status: 'active' | 'inactive' | 'suspended'): Promise<User> {
    const response = await axios.put(`${API_URL}/admin/users/${userId}`, { status });
    return response.data;
  },

  // Delete a user
  async deleteUser(userId: string): Promise<void> {
    await axios.delete(`${API_URL}/admin/users/${userId}`);
  }
};
