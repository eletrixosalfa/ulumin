const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'segredo_temporario';

const validatePassword = (password) => {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
  return true;
};

exports.register = async (req, res) => {
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
    const emailConfirmationToken = crypto.randomBytes(32).toString('hex');

    const user = new User({
      email,
      password: hashedPassword,
      isEmailConfirmed: false,
      emailConfirmationToken,
      // emailConfirmationExpires: Date.now() + 24*60*60*1000 // opcional
    });

    await user.save();

    const transporter = nodemailer.createTransport({
      // Configura aqui
    });

    const confirmUrl = `https://teusite.com/confirm-email?token=${emailConfirmationToken}`;

    const mailOptions = {
      from: '"Minha App" <no-reply@minhaapp.com>',
      to: email,
      subject: 'Confirmação de Email',
      text: `Olá! Por favor confirma teu email clicando no link: ${confirmUrl}`,
      html: `<p>Olá! Por favor confirma teu email clicando no link: <a href="${confirmUrl}">Confirmar Email</a></p>`
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Utilizador criado com sucesso! Verifica o email para ativar a conta.' });

  } catch (err) {
    res.status(500).json({ message: 'Erro ao registar.', error: err.message });
  }
};

exports.confirmEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'Token de confirmação ausente.' });
  }

  try {
    const user = await User.findOne({ emailConfirmationToken: token });
    if (!user) {
      return res.status(400).json({ message: 'Token inválido ou expirado.' });
    }

    user.isEmailConfirmed = true;
    user.emailConfirmationToken = undefined;
    // user.emailConfirmationExpires = undefined; // se usares expiração
    await user.save();

    res.status(200).json({ message: 'Email confirmado com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao confirmar email.', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Utilizador não encontrado.' });
    }

    if (!user.isEmailConfirmed) {
      return res.status(403).json({
        error: 'EMAIL_NOT_CONFIRMED',
        message: 'Por favor confirma o teu email antes de fazer login.'
      });
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
