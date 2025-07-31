const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
  try {
    const { name, room } = req.body;

    const newCategory = new Category({
      name,
      room,
      owner: req.user.userId,
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar categoria.', error: err.message });
  }
};

exports.getCategoriesByRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const categories = await Category.find({
      room: roomId,
      owner: req.user.userId,
    });

    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter categorias.', error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const updated = await Category.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.userId },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Categoria não encontrada.' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar categoria.', error: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.userId,
    });
    if (!deleted) return res.status(404).json({ message: 'Categoria não encontrada.' });
    res.json({ message: 'Categoria eliminada.' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao eliminar categoria.', error: err.message });
  }
};
