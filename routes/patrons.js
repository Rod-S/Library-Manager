var express = require('express');
var router = express.Router();
var Patron = require('../models').Patron;

/* GET patron list */
router.get('/', function (req, res, next) {

  Patron.findAll()
  .then((patrons) => {
    res.render("all_patrons", {patrons: patrons});
  });
});

router.get('/new', function(req, res, next) {
  res.render('new_patron', {patron: Patron.build(), title: "New Patron" })
});

router.get('/:id', function(req, res, next) {
  Patron.findById(req.params.id).then((patron) => {
    res.render("patron_detail", {
      patron: patron,
      first_name: patron.first_name,
      last_name: patron.last_name,
      address: patron.address,
      email: patron.email,
      library_id: patron.library_id,
      zip_code: patron.zip_code
    });
  });
});

module.exports = router;
