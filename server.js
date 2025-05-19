const express = require('express');
const mongoose = require('mongoose');
const locationRouter = require('./routes/api/location');
const searchRouter = require('./routes/api/search');
const indexRouter = require('./routes/index');
const addLocationRouter = require('./routes/add');
const geocodeRouter = require('./routes/geocode');
const siteRouter = require('./routes/site');
require('dotenv').config();
const cors = require('cors');

var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const app = express();
app.use(express.json());
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/index', indexRouter);
app.use('/add', addLocationRouter);
app.use('/geocode', geocodeRouter);
app.use('/', siteRouter);
app.use('/api/locations', locationRouter);
app.use('/api/search', searchRouter);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Erro ao conectar MongoDB:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
