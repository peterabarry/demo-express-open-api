'use strict'

module.exports.listPets = function listPets(req, res, next) {
  res.send({
    message: 'This is the mockup controller for listPets'
  });
};

module.exports.createPets = function createPets(req, res, next) {
  res.send({
    message: 'This is the mockup controller for createPets'
  });
};