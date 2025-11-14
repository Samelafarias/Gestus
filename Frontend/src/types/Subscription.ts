export interface Subscription {
  id: string; // Um ID único para identificação
  name: string; // Nome: Ex: Netflix
  value: number; // Valor: Ex: 39.90
  recurrence: 'Mensal' | 'Anual' | 'Trimestral' | 'Semestral'; // Periodicidade
  firstChargeDate: Date; // Data da Primeira Cobrança
  category: 'Streaming' | 'Música' | 'Software' | 'Educação' | 'Outros'; // Categoria
  paymentMethod?: string; // Forma de pagamento (opcional, para detalhe)
  notes?: string; // Notas (opcional, para detalhe)
  isActive: boolean; // Status (Ativa/Inativa)
}