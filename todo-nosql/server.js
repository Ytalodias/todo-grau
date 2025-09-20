const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./db'); // Conexão com MongoDB

const Task = require('./models/Task');
const authRoutes = require("./routes/auth");
const authMiddleware = require('./middleware/auth');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // substitui bodyParser

// Rotas de autenticação
app.use("/auth", authRoutes);

// Rotas de tarefas (protegidas por JWT)
app.post('/tasks', authMiddleware, async (req, res) => {
    try {
        const task = new Task({ ...req.body, userId: req.user.id });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao criar tarefa" });
    }
});

app.get('/tasks', authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id });
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao listar tarefas" });
    }
});

app.put('/tasks/:id', authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            req.body,
            { new: true }
        );
        if(!task) return res.status(404).json({ error: "Tarefa não encontrada" });
        res.json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao atualizar tarefa" });
    }
});

app.delete('/tasks/:id', authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if(!task) return res.status(404).json({ error: "Tarefa não encontrada" });
        res.json({ message: 'Tarefa deletada' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao deletar tarefa" });
    }
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
