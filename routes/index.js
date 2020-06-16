const express = require('express');
const router = express.Router();
const connection = require('../connection');
const events = require('./events');

router.use('/events', events);

module.exports = router;