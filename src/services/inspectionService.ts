import { supabase } from '../lib/supabaseClient';

export interface InspectionFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  metadata: {
    size: number;
    mimetype: string;
    cacheControl: string;
  };
  publicUrl: string;
}

export interface InspectionFileRecord {
  id?: number;
  vehicle_id: string;
  owner_id: string;
  file_url: string;
  created_at?: string;
}

export const getInspectionFiles = async (): Promise<InspectionFile[]> => {
  try {
    console.log('Fetching inspection files from Supabase bucket...');
    
    // List all files in the inspection_files bucket, inspections subdirectory
    const { data, error } = await supabase.storage
      .from('inspection_files')
      .list('inspections', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    console.log('Supabase storage response:', { data, error });

    if (error) {
      console.error('Error fetching inspection files:', error);
      throw error;
    }

    console.log(`Found ${data?.length || 0} files in inspection_files bucket`);

    // Get public URLs for all files
    const filesWithUrls = await Promise.all(
      data.map(async (file) => {
        const { data: { publicUrl } } = supabase.storage
          .from('inspection_files')
          .getPublicUrl(file.name);

        return {
          name: file.name,
          id: file.id,
          updated_at: file.updated_at || file.created_at,
          created_at: file.created_at,
          metadata: {
            size: file.metadata?.size || 0,
            mimetype: file.metadata?.mimetype || 'application/octet-stream',
            cacheControl: file.metadata?.cacheControl || '3600'
          },
          publicUrl
        };
      })
    );

    return filesWithUrls;
  } catch (error) {
    console.error('Error in getInspectionFiles:', error);
    throw error;
  }
};

export const deleteInspectionFile = async (fileName: string): Promise<void> => {
  try {
    
    const { error } = await supabase.storage
      .from('inspection_files')
      .remove([fileName]);

    if (error) {
      console.error('Error deleting inspection file:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteInspectionFile:', error);
    throw error;
  }
};

export const getInspectionFileRecords = async (): Promise<InspectionFileRecord[]> => {
  try {
    console.log('Fetching inspection file records from database...');
    
    const { data, error } = await supabase
      .from('inspection_files')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching inspection file records:', error);
      throw error;
    }

    console.log(`Found ${data?.length || 0} inspection file records`);
    return data as InspectionFileRecord[];
  } catch (error) {
    console.error('Error in getInspectionFileRecords:', error);
    throw error;
  }
};

export const saveInspectionFileRecord = async (
  vehicleId: string,
  ownerId: string,
  fileUrl: string
): Promise<InspectionFileRecord> => {
  try {
    console.log('Saving inspection file record to database:', { vehicleId, ownerId, fileUrl });
    
    const { data, error } = await supabase
      .from('inspection_files')
      .insert({
        vehicle_id: vehicleId,
        owner_id: ownerId,
        file_url: fileUrl,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving inspection file record:', error);
      throw error;
    }

    console.log('Successfully saved inspection file record:', data);
    return data as InspectionFileRecord;
  } catch (error) {
    console.error('Error in saveInspectionFileRecord:', error);
    throw error;
  }
};
