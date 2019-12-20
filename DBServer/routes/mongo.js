var express = require('express');
var router = express.Router();
var MongoController = require('../public/javascripts/MongoController');

/* GET listing. */
router.get('/', MongoController.getHelp);
router.get('/projects/', MongoController.getList);
router.get('/projects/:id', MongoController.getById);
router.post('/projects/:id', MongoController.updateItem);
router.delete('/projects/:id', MongoController.deleteItem);
router.get('/projects/:id/businessInfo', MongoController.getBusinessInfo);

module.exports = router;



