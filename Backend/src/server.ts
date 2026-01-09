import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.routes';

dotenv.config();

const app = express();

app.use(cors()); // Permite que o fornt acesse a api
app.use(express.json()); // Permite que a api entenda o json no corpao das requisições

// Rotas
app.use('/auth', authRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
});