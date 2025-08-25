import { useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type InspectionFile = {
  id: number;
  vehicle_id: string;
  owner_id: number;
  file_url: string;
  created_at: string;
};

export const useInspectionFiles = (ownerId: string) => {
  const [inspectionFiles, setInspectionFiles] = useState<InspectionFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchInspectionFiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/owners?ownerId=${ownerId}&type=inspection`);
      if (!res.ok) throw new Error('Failed to fetch inspection files');
      const data = await res.json();
      setInspectionFiles(data);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [ownerId]);

  const uploadInspectionFile = useCallback(async (file: File, vehicleId: string) => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);
    try {
      // Upload file to Supabase storage (public bucket 'inspection-files')
      const fileName = `${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage.from('inspection-files').upload(fileName, file, { upsert: false });
      if (error) {
        console.error('Supabase upload error:', error.message, error);
        throw error;
      }
      setUploadProgress(50);
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('inspection-files')
        .getPublicUrl(fileName);
      const file_url = urlData?.publicUrl || '';
      // Save file metadata to DB
      const res = await fetch('/api/owners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicle_id: vehicleId,
          owner_id: ownerId,
          file_url,
        }),
      });
      if (!res.ok) throw new Error('Failed to save inspection file');
      setUploadProgress(100);
      await fetchInspectionFiles();
      return { success: true };
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      return { success: false };
    } finally {
      setIsUploading(false);
    }
  }, [ownerId, fetchInspectionFiles]);

  const deleteInspectionFile = useCallback(async (fileId: string) => {
    // TODO: Implement delete logic if needed
    return { success: true };
  }, []);

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
