export interface InspectionFile {
  id: string;
  owner_id: string;
  vehicle_id: string;
  file_path: string;
  created_at: string;
}

export type CreateInspectionFilePayload = Omit<InspectionFile, 'id' | 'created_at'>;
