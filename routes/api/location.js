const express = require('express');
const router = express.Router();
const Location = require('../../models/location');
const axios = require('axios');

// Utilitário para tratamento de erros async
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Validação de coordenadas
const validateCoordinates = (latitude, longitude) => {
  return typeof latitude === 'number' && typeof longitude === 'number';
};

// Middleware para validar ID e buscar localização
const findLocationById = async (id, res) => {
  const location = await Location.findById(id);
  if (!location) {
    res.status(404).json({ error: 'Localização não encontrada' });
    return null;
  }
  return location;
};

// GET - Todas as localizações
router.get('/', asyncHandler(async (req, res) => {
  const locations = await Location.find();
  res.status(200).json(locations);
}));

// GET - Localização por ID
router.get('/:id', asyncHandler(async (req, res) => {
  const location = await findLocationById(req.params.id, res);
  if (location) res.status(200).json(location);
}));

// POST - Criar nova localização
router.post('/', asyncHandler(async (req, res) => {
  const { latitude, longitude, name } = req.body;

  if (!validateCoordinates(latitude, longitude)) {
    return res.status(400).json({ error: 'Latitude e longitude devem ser números' });
  }

  const existing = await Location.findOne({
    'location.coordinates': [longitude, latitude]
  });

  if (existing){
    existing.count += 1;
    await existing.save();
    return res.status(200).json({ message: 'Localização já existia. Contagem incrementada.', location: existing});
  }

  const newLocation = new Location({
    name,
    location: {
      type: 'Point',
      coordinates: [longitude, latitude]
    },
    count: 1 //começa com 1
  });

  await newLocation.save();
  res.status(201).json({ message: 'Localização salva com sucesso!', location: newLocation });
}));

// PUT - Atualizar localização por ID
router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { latitude, longitude, name, count } = req.body;

  const updateData = {};

  if (name) updateData.name = name;
  if (count !== undefined) updateData.count = count;

  if (latitude !== undefined && longitude !== undefined) {
    if (!validateCoordinates(latitude, longitude)) {
      return res.status(400).json({ error: 'Latitude e longitude devem ser números' });
    }
    updateData.location = {
      type: 'Point',
      coordinates: [longitude, latitude]
    };
  }

  const updatedLocation = await Location.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  });

  if (!updatedLocation) {
    return res.status(404).json({ error: 'Localização não encontrada' });
  }

  res.status(200).json({ message: 'Localização atualizada', location: updatedLocation });
}));

// DELETE - Remover localização
router.delete('/:id', asyncHandler(async (req, res) => {
  const deletedLocation = await Location.findByIdAndDelete(req.params.id);

  if (!deletedLocation) {
    return res.status(404).json({ error: 'Localização não encontrada' });
  }

  res.status(200).json({ message: 'Localização removida com sucesso' });
}));

// POST - cria uma nova localização a partir de um CEP
router.post('/cep', asyncHandler(async (req, res) => {
  const { cep, count } = req.body;

  if (!cep) {
    return res.status(400).json({ error: 'CEP é obrigatório' });
  }

  const response = await axios.get(`https://cep.awesomeapi.com.br/json/${cep}`);
  const data = response.data;

  const latitude = parseFloat(data.lat);
  const longitude = parseFloat(data.lng);

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: 'Coordenadas inválidas retornadas pelo serviço de CEP' });
  }

  const newLocation = new Location({
    name: data.address,
    location: {
      type: 'Point',
      coordinates: [longitude, latitude]
    },
    count: count ?? 0
  });

  await newLocation.save();

  res.status(201).json({
    message: 'Localização criada a partir do CEP',
    location: newLocation
  });
}));

// Tratamento central de erros
router.use((err, req, res, next) => {
  console.error(err); // log para debug
  res.status(500).json({ error: 'Erro interno do servidor' });
});

module.exports = router;
