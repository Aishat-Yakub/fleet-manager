import { useState, useCallback, useEffect } from 'react';
import { InspectionFile } from '../types';
import { fetchApi } from '@/lib/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lasu-fleet.free.nf/api';

export const useInspectionFiles = (ownerId: string) => {
  const [inspectionFiles, setInspectionFiles] = useState<InspectionFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchInspectionFiles = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Define a type for the raw API response
      type ApiInspectionFile = {
        id: number;
        filename: string;
        file_url: string;
        file_path: string;
        created_at: string;
        vehicle_id: number | null;
        file_size: number;
      };

      const data = await fetchApi<ApiInspectionFile[]>(`/inspection-files?ownerId=${ownerId}`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      // Transform the response to match our frontend types if needed
      const formattedData = data.map((file) => ({
        id: file.id.toString(),
        name: file.filename || 'Inspection File',
        url: file.file_url || `https://lasu-fleet.free.nf/storage/${file.file_path}`,
        uploadedAt: file.created_at || new Date().toISOString(),
        vehicleId: file.vehicle_id?.toString() || '',
        size: file.file_size || 0
      }));

      setInspectionFiles(formattedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching inspection files:', err);
    } finally {
      setIsLoading(false);
    }
  }, [ownerId]);

  const uploadInspectionFile = useCallback(async (file: File, vehicleId: string) => {
    const formData = new FormData();
    formData.append('inspection_file', file);
    formData.append('vehicle_id', vehicleId);
    formData.append('owner_id', ownerId);

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);

      const xhr = new XMLHttpRequest();
      
      return new Promise((resolve, reject) => {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
          }
        };

        xhr.onload = async () => {
          try {
            if (xhr.status >= 200 && xhr.status < 300) {
              // Refresh the files list after successful upload
              await fetchInspectionFiles();
              resolve({ success: true });
            } else {
              const errorData = JSON.parse(xhr.responseText);
              throw new Error(errorData.message || 'Upload failed');
            }
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
            reject(err);
          } finally {
            setIsUploading(false);
          }
        };

        xhr.onerror = () => {
          setError('Upload failed. Please check your connection.');
          setIsUploading(false);
          reject(new Error('Network error'));
        };

        xhr.open('POST', `${API_BASE_URL}/inspection-files/upload`, true);
        
        // Add authentication header if needed
        // xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        
        xhr.send(formData);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setIsUploading(false);
      throw err;
    }
  }, [ownerId, fetchInspectionFiles]);

  const deleteInspectionFile = useCallback(async (fileId: string) => {
    try {
      setError(null);
      
      await fetchApi(`/inspection-files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Refresh the files list after successful deletion
      await fetchInspectionFiles();
      return { success: true };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to delete file';
      setError(error);
      console.error('Error deleting file:', err);
      return { success: false, error };
    }
  }, [fetchInspectionFiles]);

  // Fetch files when the component mounts
  useEffect(() => {
    fetchInspectionFiles();
  }, [fetchInspectionFiles]);

  return {
    inspectionFiles,
    isLoading,
    isUploading,
    uploadProgress,
    error,
    fetchInspectionFiles,
    uploadInspectionFile,
    deleteInspectionFile,
  };
};
