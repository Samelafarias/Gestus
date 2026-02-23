import { v4 as uuidv4 } from 'uuid';
import pool from '../database';
import { SubscriptionModel } from '../models/Subscription';

export class SubscriptionService {
    async create(userId: string, data: Omit<SubscriptionModel, 'id' | 'user_id' | 'created_at' | 'is_active' | 'is_paid'>) {
        const id = uuidv4();
        const query = `
            INSERT INTO subscriptions (
                id, user_id, name, value, recurrence, first_charge_date, category, payment_method, notes
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `;

        const values = [
            id, userId, data.name, data.value, data.recurrence, 
            data.first_charge_date, data.category, data.payment_method, data.notes
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async listAll(userId: string) {
        const query = 'SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY first_charge_date ASC';
        const result = await pool.query(query, [userId]);
        return result.rows;
    }

    async updateStatus(id: string, userId: string, isActive: boolean) {
        const query = 'UPDATE subscriptions SET is_active = $1 WHERE id = $2 AND user_id = $3 RETURNING *';
        const result = await pool.query(query, [isActive, id, userId]);
        
        if (result.rows.length === 0) throw new Error('Assinatura não encontrada.');
        return result.rows[0];
    }

    async pay(id: string, userId: string) {
    // Busca a assinatura atual
        const subResult = await pool.query('SELECT * FROM subscriptions WHERE id = $1 AND user_id = $2', [id, userId]);
        if (subResult.rows.length === 0) throw new Error('Assinatura não encontrada.');
        
        const sub = subResult.rows[0];
        const nextDate = new Date(sub.first_charge_date);

    // Lógica de recorrência (vinda do seu código original)
        if (sub.recurrence === 'Mensal') nextDate.setMonth(nextDate.getMonth() + 1);
        else if (sub.recurrence === 'Anual') nextDate.setFullYear(nextDate.getFullYear() + 1);
        else if (sub.recurrence === 'Trimestral') nextDate.setMonth(nextDate.getMonth() + 3);
        else if (sub.recurrence === 'Semestral') nextDate.setMonth(nextDate.getMonth() + 6);

    // Atualiza no banco
        const updateQuery = 'UPDATE subscriptions SET first_charge_date = $1, is_paid = true WHERE id = $2 RETURNING *';
        const result = await pool.query(updateQuery, [nextDate, id]);
        return result.rows[0];
}

    async update(id: string, userId: string, data: Partial<SubscriptionModel>) {
    const query = `
        UPDATE subscriptions 
        SET 
        name = COALESCE($1, name),
        value = COALESCE($2, value),
        recurrence = COALESCE($3, recurrence),
        first_charge_date = COALESCE($4, first_charge_date),
        category = COALESCE($5, category),
        payment_method = COALESCE($6, payment_method),
        notes = COALESCE($7, notes)
        WHERE id = $8 AND user_id = $9
        RETURNING *
    `;

    const values = [
        data.name, 
        data.value, 
        data.recurrence, 
        data.first_charge_date, 
        data.category, 
        data.payment_method, 
        data.notes,
        id,
        userId
    ];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
        throw new Error('Assinatura não encontrada ou sem permissão para editar.');
    }

    return result.rows[0];
    }

    async delete(id: string, userId: string) {
        const query = 'DELETE FROM subscriptions WHERE id = $1 AND user_id = $2 RETURNING *';
        const result = await pool.query(query, [id, userId]);

        if (result.rows.length === 0) {
            throw new Error('Assinatura não encontrada ou você não tem permissão para excluí-la.');
        }

        return { message: 'Assinatura excluída com sucesso.' };
}
}