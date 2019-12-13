'use strict'

var varpetsController = require('./petsControllerService');

module.exports.listPets = function listPets(req, res, next) {
  varpetsController.listPets(req.swagger.params, res, next);
};

module.exports.createPets = function createPets(req, res, next) {
  varpetsController.createPets(req.swagger.params, res, next);
};