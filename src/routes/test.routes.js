const express = require('express');
const testController = require('../controllers');

const eventRoutes = express.Router({});

eventRoutes.get('/', testController.pong);
module.exports = eventRoutes;
