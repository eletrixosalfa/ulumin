const User = require('../models/UpdateUser');
const bcrypt = require('bcrypt');

exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.userId; // do authMiddleware
    const { name, email, password } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Utilizador não encontrado.' });

    if (name) user.name = name;
    if (email) user.email = email;

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      user.password = hashed;
    }

    await user.save();

    res.status(200).json({ message: 'Dados atualizados com sucesso.', user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar dados.', error: err.message });
  }
};
