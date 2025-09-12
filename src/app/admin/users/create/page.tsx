"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CreateUserPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role_id: '3', // Default to manager role
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role_id: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/owners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'users',
          email: formData.email,
          password: formData.password,
          role_id: Number(formData.role_id),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || 'Failed to create user');
      }

      router.push('/admin/users');
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="container mx-auto px-4 w-full">
        <Card className="border-0 shadow-none">
          <CardHeader className="px-0 pt-0">    
            <CardTitle className="text-sky-900 text-2xl md:text-3xl">Create New User</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg w-full">
                  {error}
                </div>
              )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sky-900 font-medium">Email
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className='bg-white border text-sky-950 placeholder:text-sky-950/40 border-sky-950/30 focus:border-sky-500 focus:ring-sky-500'
                placeholder="Enter user email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sky-900 font-medium">Password
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className='bg-white border text-sky-950 placeholder:text-sky-950/40 border-sky-950/30 focus:border-sky-500 focus:ring-sky-500'
                placeholder="Enter password (min 6 characters)"
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sky-900 font-medium">Role
                <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.role_id} onValueChange={handleRoleChange}>
                <SelectTrigger className="w-full bg-white border text-sky-950 placeholder:text-sky-950/40 border-sky-950/30 focus:border-sky-500 focus:ring-sky-500">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3" className='text-sky-950 shadow-none'>Manager</SelectItem>
                  <SelectItem value="2" className='text-sky-950 shadow-none'>Admin</SelectItem>
                  <SelectItem value="1" className='text-sky-950 shadow-none'>User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
                disabled={isLoading}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-sky-900 hover:bg-sky-800 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create User'}
              </Button>
            </div>
          </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateUserPage;
