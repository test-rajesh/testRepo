const express = require('express');

const apiRoutes = express.Router();

const testRoutes = require('./test.routes');

apiRoutes.use('/test', testRoutes);

apiRoutes.use('*', (err, req, res, next) => next(new Error('router not found!!')));

module.exports = apiRoutes;
