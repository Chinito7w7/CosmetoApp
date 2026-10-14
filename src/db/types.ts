export type AppointmentStatus = 'pending' | 'completed' | 'cancelled';
export type PaymentMethod = 'cash' | 'transfer' | 'mercadopago' | 'card';

export interface CategoryRow {
  id: number;
  name: string;
  color_key: string;
  sort_order: number;
  is_active: number;
  created_at: string;
}

export interface ServiceRow {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  duration_min: number;
  base_price: number;
  is_active: number;
  created_at: string;
}

export interface ServiceWithCategory extends ServiceRow {
  category_name: string;
  category_color_key: string;
  category_is_active: number;
}

export interface ClientRow {
  id: number;
  full_name: string;
  phone: string;
  birth_date: string | null;
  email: string | null;
  occupation: string | null;
  alert_text: string | null;
  created_at: string;
}

export interface AppointmentRow {
  id: number;
  client_id: number;
  starts_at: string;
  status: AppointmentStatus;
  notes: string | null;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface AppointmentServiceRow {
  id: number;
  appointment_id: number;
  service_id: number;
  service_name: string;
  duration_min: number;
  price: number;
}

export interface PaymentRow {
  id: number;
  appointment_id: number;
  amount: number;
  method: PaymentMethod;
  paid_at: string;
  note: string | null;
  created_at: string;
}

export interface FichaVersionRow {
  id: number;
  client_id: number;
  type: string;
  data: string;
  created_at: string;
}
