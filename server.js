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
  leito:      { type: String, required: true },
  nome:       { type: String, required: true },
  dias:       String,
  hda:        String,
  atb:        String,
  diaAtb:     String,
  contato:    String,
  obs:        String,
  pendencias: [String],
  status:     [String],
  prioridade: String,
  criadoEm:   { type: Date, default: Date.now }
});

const Paciente = mongoose.model('Paciente', PacienteSchema);

app.get('/api/pacientes', async (req, res) => {
  console.log('GET /api/pacientes');
  try {
    const pacientes = await Paciente.find().sort({ leito: 1 });
    console.log('Retornando', pacientes.length, 'pacientes');
    res.json(pacientes);
  } catch (e) {
    console.error('Erro GET:', e.message);
    res.status(500).json({ erro: e.message });
  }
});

app.post('/api/pacientes', async (req, res) => {
  console.log('POST /api/pacientes', JSON.stringify(req.body));
  try {
    const p = new Paciente(req.body);
    await p.save();
    console.log('Paciente salvo:', p._id);
    res.status(201).json(p);
  } catch (e) {
    console.error('Erro POST:', e.message);
    res.status(400).json({ erro: e.message });
  }
});

app.put('/api/pacientes/:id', async (req, res) => {
  console.log('PUT /api/pacientes/', req.params.id);
  try {
    const p = await Paciente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(p);
  } catch (e) {
    console.error('Erro PUT:', e.message);
    res.status(400).json({ erro: e.message });
  }
});

app.delete('/api/pacientes/:id', async (req, res) => {
  console.log('DELETE /api/pacientes/', req.params.id);
  try {
    await Paciente.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    console.error('Erro DELETE:', e.message);
    res.status(400).json({ erro: e.message });
  }
});

app.delete('/api/pacientes', async (req, res) => {
  console.log('DELETE /api/pacientes (all)');
  try {
    await Paciente.deleteMany({});
    res.json({ ok: true });
  } catch (e) {
    console.error('Erro DELETE all:', e.message);
    res.status(400).json({ erro: e.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Passômetro rodando na porta ${PORT}`));
