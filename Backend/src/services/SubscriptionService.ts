// src/services/SubscriptionService.ts
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
}