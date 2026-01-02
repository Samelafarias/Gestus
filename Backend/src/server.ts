import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Carrega as variáveis do .env 
dotenv.config();

const app = express();

// Middlewares
app.use(cors()); // Permite que o App React Native aceda à API
app.use(express.json()); // Permite que a API entenda JSON no corpo das requisições

// Rota de teste para verificar se a API está online
app.get('/health', (req, res) => {
  return res.json({ status: 'OK', message: 'Servidor Gestus está a correr!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor executando em http://localhost:${PORT}`);
});