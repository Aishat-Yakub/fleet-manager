export interface ConditionUpdate {
  id: string;
  owner_id: string;
  vehicle_id: string;
  condition: string;
  notes: string;
  created_at: string;
}

export type CreateConditionUpdatePayload = Omit<ConditionUpdate, 'id' | 'created_at'>;
