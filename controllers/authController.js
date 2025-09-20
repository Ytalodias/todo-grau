const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Criptografa senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Salva usuário no banco
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Busca usuário
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    // Compara senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Senha inválida' });

    // Gera token JWT
    const token = jwt.sign({ id: user._id }, 'secreta', { expiresIn: '1h' });

    res.json({ message: 'Login bem-sucedido!', token });
  } catch (error) {
    res.status(500).json({ error: 'Erro no login' });
  }
};

const logoutUser = (req, res) => {
  // Se usar JWT, basta o front apagar o token
  res.json({ message: 'Logout realizado' });
};

module.exports = { registerUser, loginUser, logoutUser };
