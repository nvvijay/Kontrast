var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.send(
	  "<body>You have reached the server.<br>Connect to the client by clicking <a href=\"http://localhost:1234\"> here. </a></body>"
  );
});

module.exports = router;
