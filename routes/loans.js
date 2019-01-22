//import modules, sequelize models

var express = require('express');
var router = express.Router({mergeParams: true});
var Loan = require('../models').Loan;
var Book = require('../models').Book;
var Patron = require('../models').Patron;
var { Op } = require('sequelize');

/* set global date variables to be used in pug templates */
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
  }).catch((err) => {
    res.sendStatus(500);
  });;
});

/* POST create loan */
router.post('/', (req, res, next) => {
  Loan.create(req.body)
  .then((loan) => {
    res.redirect('/loans/');
  })
  //render new_loan with validation errors
  .catch((err) => {
    if (err.name === 'SequelizeValidationError') {
      return Promise.all([
        Book.findAll()
        .then(books => books),
        Patron.findAll()
      ]).
        then(([books, patrons]) => {
          res.render('new_loan', {
            loan: Loan.build(),
            title: "New Loan",
            returnDate: date,
            books: books,
            patrons: patrons,
            errors: err.errors
          });
        });
    } else {
      throw err;
    }
  });
});

/* GET overdue loans */
router.get('/overdue', (req, res, next) => {
  Loan.findAll({
    where: {'returned_on': null, 'return_by': {[Op.lt]: Date() } } ,
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
  })
  .then((loans)=> {
    //render overdue_loans_loan HTML if overdue loans exist
    if (loans) {
      res.render("overdue_loans_loan", {
        loans: loans,
        books: loans[0].Book,
        patron: loans[0].Patron
      });
    //render overdue_loans HTML if no overdue loans exist
    } else {
      res.render("overdue_loans", {
        loans: loans,
        id: req.params.id
      });
    }
  }).catch((err) => {
    res.sendStatus(500);
  });
});

/* GET checked out loans */
router.get('/checked_out', (req, res, next) => {
  Loan.findAll({
    where: {'returned_on': null },
    include: [
      {
        model: Book,
        required: true
      }, {
        model: Patron,
        required: true
      }
    ]
  })
  .then((loans)=> {
    //render checked_loans_loan HTML if checked out loans exist
    if (loans) {
      res.render("checked_loans_loan", {
        loans: loans,
        books: loans[0].Book,
        patrons: loans[0].Patron
      });
    //render checked_loans HTML if no checked out loans exist
    } else {
      res.render("checked_loans", {
        loans: loans,
        id: req.params.id
      });
    }
  }).catch((err) => {
    res.sendStatus(500);
  });;
});

/* CREATE new loan form */
router.get('/new', function(req, res, next) {
  //Place unrelated queries in a single promise to render when resolved
  return Promise.all([
    Book.findAll()
    .then(books => books),
    Patron.findAll()
  ]).
    then(([books, patrons]) => {
      res.render('new_loan', {
        loan: Loan.build(),
        title: "New Loan",
        returnDate: date,
        books: books,
        patrons: patrons
      });
    }).catch((err) => {
      res.sendStatus(500);
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
  }).catch((err) => {
    res.sendStatus(500);
  });;
});

module.exports = router;
