// Reflete os Enus criados no SQL
export type RecurrenceType = 'Mensal' | 'Anual' | 'Trimestral' | 'Semestral';
export type CategoryType = 'Streaming' | 'Música' | 'Software' | 'Educação' | 'Outros';

export interface SubscriptionModel {
  id: string;
  user_id: string;
  name: string;
  value: number;
  recurrence: RecurrenceType;
  first_charge_date: Date;
  category: CategoryType;
  payment_method?: string;
  notes?: string;
  is_active: boolean;
  is_paid: boolean;
  created_at: Date;
}
}