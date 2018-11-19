var express = require('express');
var router = express.Router();
var Loan = require('../models').Loan;
var Book = require('../models').Book;
var Patron = require('../models').Patron;


/* GET loan list */
router.get('/', function(req, res, next) {
  Loan.findAll({
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
    res.render("all_loans", {loans: loans});
  });
});

router.get('/new', function(req, res, next) {
  res.render('new_loan', {
    loan: Loan.build(),
    title: "New Loan"
  });
});

/* GET return book page */
router.get('/:id/return_book', function(req, res, next) {
  Loan.findAll({
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
    res.render("return_book", {loans: loans});
  });
});

module.exports = router;
