import {Pool} from 'pg';
import dotenv from 'dotenv';

// Garante que as variáveis .env sejam carregadas
dotenv.config();

//Configura o Pool para conexões
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Teste de conexão inicial
pool.on('connect', () => {
  console.log('PostgreSQL: Conexão estabelecida com sucesso!');
});

pool.on('error', (err) => {
  console.error('PostgreSQL: Erro inesperado no cliente', err);
});

export default pool;