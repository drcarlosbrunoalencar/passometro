const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Erro MongoDB:', err));

const PacienteSchema = new mongoose.Schema({
  leito:             { type: String, required: true },
  nome:              { type: String, required: true },
  dataIntern:        String,
  hda:               String,
  atb:               String,
  diaAtb:            String,
  obs:               String,
  pendencias:        [String],
  pendenciasFeitas:  [String],
  status:            [String],
  prioridade:        String,
  evolucaoConcluida: { type: Boolean, default: false },
  criadoEm:          { type: Date, default: Date.now }
});

const Paciente = mongoose.model('Paciente', PacienteSchema);

app.get('/api/pacientes', async (req, res) => {
  try {
    const pacientes = await Paciente.find().sort({ leito: 1 });
    res.json(pacientes);
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

app.post('/api/pacientes', async (req, res) => {
  try {
    const p = new Paciente(req.body);
    await p.save();
    res.status(201).json(p);
  } catch (e) { res.status(400).json({ erro: e.message }); }
});

app.put('/api/pacientes/:id', async (req, res) => {
  try {
    const p = await Paciente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(p);
  } catch (e) { res.status(400).json({ erro: e.message }); }
});

app.delete('/api/pacientes/:id', async (req, res) => {
  try {
    await Paciente.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) { res.status(400).json({ erro: e.message }); }
});

app.delete('/api/pacientes', async (req, res) => {
  try {
    await Paciente.deleteMany({});
    res.json({ ok: true });
  } catch (e) { res.status(400).json({ erro: e.message }); }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Passômetro rodando na porta ${PORT}`));
