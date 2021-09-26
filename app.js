const express = require('express');
const app = express();
const cors = require('cors');
const unlimOutOfSerRoutes = require('./unlimited/routes/out_of_service_routes');

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'));

app.use('/unlimited-out-of-service', unlimOutOfSerRoutes);

module.exports = app;