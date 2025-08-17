import { supabase } from '@/lib/supabase';
import { InspectionFile, CreateInspectionFilePayload } from '@/types/inspectionFile';

const BUCKET_NAME = 'inspection_files';

export const inspectionFileService = {
  async getInspectionFilesByOwner(ownerId: string): Promise<InspectionFile[]> {
    const { data, error } = await supabase
      .from('inspection_files')
      .select('*')
      .eq('owner_id', ownerId);

    if (error) {
      console.error('Error fetching inspection files:', error);
      throw new Error(error.message);
    }

    return data || [];
  },

  async uploadInspectionFile(file: File, payload: Omit<CreateInspectionFilePayload, 'file_path'>): Promise<InspectionFile> {
    const filePath = `${payload.owner_id}/${payload.vehicle_id}/${Date.now()}-${file.name}`;

    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      throw new Error(uploadError.message);
    }

    // Create record in database
    const { data, error: dbError } = await supabase
      .from('inspection_files')
      .insert({ ...payload, file_path: filePath })
      .select();

    if (dbError) {
      console.error('Error creating inspection file record:', dbError);
      // Attempt to clean up the uploaded file if the DB insert fails
      await supabase.storage.from(BUCKET_NAME).remove([filePath]);
      throw new Error(dbError.message);
    }

    if (!data || data.length === 0) {
      throw new Error('Inspection file record creation failed.');
    }

    return data[0];
  },

  async deleteInspectionFile(fileId: string, filePath: string): Promise<void> {
    // Delete file from storage
    const { error: storageError } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);
    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
      throw new Error(storageError.message);
    }

    // Delete record from database
    const { error: dbError } = await supabase.from('inspection_files').delete().eq('id', fileId);
    if (dbError) {
      console.error('Error deleting inspection file record:', dbError);
      throw new Error(dbError.message);
    }
  },
};
