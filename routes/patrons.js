var express = require('express');
var router = express.Router();
var Patron = require('../models').Patron;
var Loan = require('../models').Loan;
var Book = require('../models').Book;

/* GET patron list */
router.get('/', function (req, res, next) {

  Patron.findAll()
  .then((patrons) => {
    res.render("all_patrons", {patrons: patrons});
  });
});

router.get('/new', function(req, res, next) {
  res.render('new_patron', {
    patron: Patron.build(),
    title: "New Patron"
  });
});

router.get('/:id', function(req, res, next) {
  Patron.findById(req.params.id)
  .then((patron) => {
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

router.get('/return_book/:id', function(req, res, next){
  Loan.findAll({
    where: {'book_id': req.params.id},
    include: [
      {
        model: Book,
        required: true
      },
      {
        model: Patron,
        required: true
      }
    ]
  }).then((loans) => {
    console.log(loans[0].Book);
    res.render("return_book", {loans: loans});
  })
});


module.exports = router;
