const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

// Registro
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ error: "Usuário já existe" });

        const user = new User({ username, password });
        await user.save();
        res.json({ message: "Usuário registrado com sucesso!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao registrar usuário" });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: "Usuário não encontrado" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ error: "Senha incorreta" });

        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao fazer login" });
    }
});

module.exports = router;
