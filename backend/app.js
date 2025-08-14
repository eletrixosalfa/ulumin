require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Importar as Rotas
const auth = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const roomRoutes = require('./routes/roomRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const usagelogRoutes = require('./routes/usagelogRoutes');
const mqttConfigRoutes = require('./routes/mqttConfigRoutes');
const updateuserRoutes = require('./routes/updateuserRoutes');
const deviceCatalogRoutes = require('./routes/deviceCatalogRoutes');

// define a rota protegida
app.get('/api/test/protected', auth, (req, res) => {
  console.log('Rota protegida foi chamada');
  res.json({ message: 'Acesso autorizado!', user: req.user});
});

// Usar as Rotas
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/usagelogs', usagelogRoutes);
app.use('/api/mqttconfig', mqttConfigRoutes);
app.use('/api/updateuser', updateuserRoutes);
app.use('/api/devicecatalog', deviceCatalogRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

app.get('/', (req, res) => {
  res.send('API a funcionar!');
});

app.listen(PORT, () => {
  console.log(`Servidor a funcionar na porta ${PORT}`);
});

const { connectMqtt } = require('./services/mqttClient');
connectMqtt();