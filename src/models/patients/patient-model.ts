// Model of the patitien table from backend
export interface Patient {
  id: string;
  document_type: string;
  document_number: string;
  full_name: string;
  birth_date: string;
  gender: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  is_active: boolean;
}
