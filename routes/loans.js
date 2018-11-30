var express = require('express');
var router = express.Router();
var Loan = require('../models').Loan;
var Book = require('../models').Book;
var Patron = require('../models').Patron;


date = new Date();
date.setDate(date.getDate() + 7);
var date = date.toISOString().split('T')[0];


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

/* POST create loan */
router.post('/', (req, res, next) => {
  console.log(req.body);
  Loan.create(req.body)
  .then((loans) => {
    res.redirect('/loans/');
  });
});


/* create a new loan form */
/*
router.get('/new', function(req, res, next) {
  Book.findAll()
  .then((books) => {
    console.log(books);
    res.render('new_loan', {
      loan: Loan.build(),
      title: "New Loan",
      returnDate: date,
      books: books
    });
  });
});
*/

router.get('/new', function(req, res, next) {
  //Place unrelated queries in a single promise to render when resolved
  return Promise.all([
    Book.findAll()
    .then(books => books),
    Patron.findAll()
  ]).
    then(([books, patrons]) => {
      console.log(patrons);
      res.render('new_loan', {
        loan: Loan.build(),
        title: "New Loan",
        returnDate: date,
        books: books,
        patrons: patrons
      });
    })
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
