import { fetchApi } from '@/lib/api';

export interface Owner {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export const ownerService = {
  // Get all owners
  async getOwners(): Promise<Owner[]> {
    const data = await fetchApi<{ owners: Owner[] }>('/owners');
    return data.owners || [];
  },

  // Get a single owner by ID
  async getOwnerById(id: string): Promise<Owner> {
    return fetchApi<Owner>(`/owners/${id}`);
  },

  // Create a new owner
  async createOwner(ownerData: Omit<Owner, 'id' | 'createdAt' | 'updatedAt'>): Promise<Owner> {
    return fetchApi<Owner>('/owners', {
      method: 'POST',
      body: JSON.stringify(ownerData),
    });
  },

  // Update an owner
  async updateOwner(id: string, ownerData: Partial<Omit<Owner, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Owner> {
    return fetchApi<Owner>(`/owners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ownerData),
    });
  },

  // Delete an owner
  async deleteOwner(id: string): Promise<void> {
    return fetchApi(`/owners/${id}`, {
      method: 'DELETE',
    });
  },
};
