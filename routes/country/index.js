const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/country/country.controller');

router.get('/all',Controller.getAllCountries);
router.get('/search',Controller.getAllCountriesNoPage);

module.exports = router;
