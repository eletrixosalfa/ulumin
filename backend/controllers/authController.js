const User = require('../models/UpdateUser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const JWT_SECRET = process.env.JWT_SECRET || 'segredo_temporario';

const validatePassword = (password) => {
  // mínimo 8 caracteres
  if (password.length < 8) return false;
  // pelo menos uma letra maiúscula
  if (!/[A-Z]/.test(password)) return false;
  // pelo menos uma letra minúscula
  if (!/[a-z]/.test(password)) return false;
  // pelo menos um número
  if (!/[0-9]/.test(password)) return false;
  // pelo menos um caractere especial
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;

  return true;
}

exports.register = async (req, res) => {
  console.log('Chegou no register:', req.body);
  const { email, password } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Formato de email inválido.' });
  }

  if (!password || !validatePassword(password)) {
    return res.status(400).json({ 
      message: 'A senha deve ter pelo menos 8 caracteres, incluir uma letra maiúscula, uma letra minúscula, um número e um caractere especial.' 
    });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email já registado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });

    await user.save();

    res.status(201).json({ message: 'Utilizador criado com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao registar.', error: err.message });
  }
};

exports.login = async (req, res) => {
  console.log('Tentativa de login:', req.body);
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Utilizador não encontrado.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao fazer login.', error: err.message });
  }
};