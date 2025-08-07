const bcrypt = require('bcrypt');
const updateuser = require('../models/UpdateUser'); // model chamado updateuser

exports.getProfile = async (req, res) => {
  try {
    const user = await updateuser.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar perfil do usuário' });
  }
};

exports.updateProfile = async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await updateuser.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar perfil' });
  }
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await updateuser.findById(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Senha atual incorreta' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();
    res.json({ message: 'Senha alterada com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao alterar senha' });
  }
};
