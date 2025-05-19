const express = require('express');
const router = express.Router();
const Location = require('../../models/location');
const openCage = require('opencage-api-client');

// Utilitário para tratamento de erros async
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// GET - Todas as localizações
router.get('/', asyncHandler(async (req, res) => {
    var maxDistance = req.query.maxDistance
    var lat = req.query.lat
    var lng = req.query.lng
  const locations = await Location.find(
  {
    location: {
     $near: {
      $maxDistance: maxDistance,
      $geometry: {
       type: "Point",
       coordinates: [lng, lat]
      }
     }
    }
   });
  res.status(200).json(locations);
}));

// POST - cria uma nova localização a partir de um CEP
router.get('/geocode', asyncHandler(async (req, res) => {

    var query = req.query.query

    if (!query) {
      return res.status(400).json({ error: 'Endereço é obrigatório!' });
    }

    const data = await openCage.geocode({ q: query, key: process.env.GEOCAGE_TOKEN }); 

      if (data.status.code === 200 && data.results.length > 0) {
          const places = data.results.map(place => ({
            address: place.components.road,
            address_formatted: place.formatted,
            geometry: place.geometry
          }));

          return res.status(201).json(places);
      } else {
        return res.status(404).json({ error: data.status.message || 'Nenhum resultado encontrado.' });
      }
}));

module.exports = router;
