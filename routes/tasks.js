const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Task = require('../models/Task');

// Listar tarefas do usuário
router.get('/', authMiddleware, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json(tasks);
});

// Criar tarefa
router.post('/', authMiddleware, async (req, res) => {
  const { task } = req.body;
  const newTask = new Task({ task, userId: req.user.id });
  await newTask.save();
  res.json(newTask);
});

// Atualizar tarefa
router.put('/:id', authMiddleware, async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
  if (!task) return res.status(404).json({ error: "Tarefa não encontrada" });

  task.task = req.body.task;
  task.completed = req.body.completed;
  await task.save();
  res.json(task);
});

// Excluir tarefa
router.delete('/:id', authMiddleware, async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!task) return res.status(404).json({ error: "Tarefa não encontrada" });

  res.json({ message: "Tarefa excluída" });
});

module.exports = router;
