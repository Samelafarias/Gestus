import pool from '../database';

export class ReportService {
  async getSubscriptionSummary(userId: string) {
    // Calcula o total por categoria e o total geral de assinaturas ATIVAS
    const query = `
      SELECT 
        category,
        SUM(value) as total_value,
        COUNT(*) as count
      FROM subscriptions
      WHERE user_id = $1 AND is_active = true
      GROUP BY category
    `;

    const result = await pool.query(query, [userId]);
    
    const totalGeneral = result.rows.reduce((acc, row) => acc + parseFloat(row.total_value), 0);

    return {
      total_general: totalGeneral,
      by_category: result.rows
    };
  }

  async getMonthlyProjection(userId: string) {
    // Esta query ajuda a projetar gastos futuros com base na recorrência
    // (Lógica simplificada: soma tudo o que é mensal + (anual / 12))
    const query = `
      SELECT 
        SUM(CASE WHEN recurrence = 'Mensal' THEN value ELSE 0 END) +
        SUM(CASE WHEN recurrence = 'Anual' THEN value / 12 ELSE 0 END) +
        SUM(CASE WHEN recurrence = 'Trimestral' THEN value / 3 ELSE 0 END) +
        SUM(CASE WHEN recurrence = 'Semestral' THEN value / 6 ELSE 0 END) as monthly_estimate
      FROM subscriptions
      WHERE user_id = $1 AND is_active = true
    `;

    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }
}