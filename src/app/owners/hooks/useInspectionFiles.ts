import { useState, useCallback } from 'react';
import { InspectionFile } from '../types';

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
      const response = await fetch(`/api/owners/${ownerId}/inspection-files`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch inspection files');
      }
      
      const data = await response.json();
      setInspectionFiles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching inspection files:', err);
    } finally {
      setIsLoading(false);
    }
  }, [ownerId]);

  const uploadInspectionFile = useCallback(async (file: File, vehicleId: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('vehicleId', vehicleId);

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

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.response);
            setInspectionFiles(prev => [...prev, response]);
            resolve({ success: true });
          } else {
            reject(new Error('Upload failed'));
          }
          setIsUploading(false);
        };

        xhr.onerror = () => {
          setError('Upload failed. Please check your connection.');
          setIsUploading(false);
          reject(new Error('Upload failed'));
        };

        xhr.open('POST', `/api/owners/${ownerId}/inspection-files`, true);
        xhr.send(formData);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setIsUploading(false);
      throw err;
    }
  }, [ownerId]);

  const deleteInspectionFile = useCallback(async (fileId: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/owners/${ownerId}/inspection-files/${fileId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete file');
      }
      
      setInspectionFiles(prev => prev.filter(file => file.id !== fileId));
      return { success: true };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to delete file';
      setError(error);
      console.error('Error deleting file:', err);
      return { success: false, error };
    }
  }, [ownerId]);

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
