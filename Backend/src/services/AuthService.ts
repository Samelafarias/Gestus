import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import pool from '../database';
import { UserModel } from '../models/User';
import jwt from 'jsonwebtoken'; 

const recoveryTokens = new Map<string, string>();

export class AuthService {
    async register(name: string, email: string, password: string): Promise<UserModel> {
        // Verifica se o email está em uso
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            throw new Error('Este email já está sendo utilizado.');
        }

        // Criptografa o password
        const passwordHash = await bcrypt.hash(password, 10);

        // Gera um id único 
        const id = uuidv4();

        // Insere no postgresql - Corrigido para $1, $2, $3, $4
        const query = `
            INSERT INTO users (id, name, email, password_hash)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, email, created_at
        `;

        const newUser = await pool.query(query, [id, name, email, passwordHash]);
        return newUser.rows[0];
    }

    async login(email: string, password: string) {
        // Corrigido para $1
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = userResult.rows[0];

        // Verifica se o usuário existe e se a senha bate
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            throw new Error('Email ou senha incorretos.');
        }

        // Gera o token - Corrigido de jtw.sing para jwt.sign
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
            expiresIn: '1d',
        });

        // Retorna os dados do usuário (sem a senha) e o token
        return {
            user: { id: user.id, name: user.name, email: user.email },
            token
        };

    }

    async sendRecoveryToken(email: string) {
        const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        const user = userResult.rows[0];

        if (!user) {
            throw new Error('Usuário não encontrado.');
        }

        // Gera um token de 6 dígitos
        const token = Math.floor(100000 + Math.random() * 900000).toString();

        // Salva o token associado ao e-mail
        recoveryTokens.set(email, token);

        // Simula o envio de e-mail (Exibe no console)
        console.log(`[RECOVERY] Token para ${email}: ${token}`);

        return { message: "Token de recuperação enviado com sucesso." };
    }

    async resetPassword(email: string, token: string, newPassword: string) {
        const storedToken = recoveryTokens.get(email);

        if (!storedToken || storedToken !== token) {
            throw new Error('Token de recuperação inválido ou expirado.');
        }

        // Gera o novo hash da senha
        const passwordHash = await bcrypt.hash(newPassword, 10);

        // Atualiza no banco de dados
        await pool.query('UPDATE users SET password_hash = $1 WHERE email = $2', [passwordHash, email]);

        // Limpa o token usado
        recoveryTokens.delete(email);

        return { message: "Senha redefinida com sucesso." };
    }
}