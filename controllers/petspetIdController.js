'use strict'

var varpetspetIdController = require('./petspetIdControllerService');

module.exports.showPetById = function showPetById(req, res, next) {
  varpetspetIdController.showPetById(req.swagger.params, res, next);
};