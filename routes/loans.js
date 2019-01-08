var express = require('express');
var router = express.Router();
var Loan = require('../models').Loan;
var Book = require('../models').Book;
var Patron = require('../models').Patron;
var { Op } = require('sequelize');


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
  .then((loan) => {
    res.redirect('/loans/');
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
    if (loans) {
          console.log(loans);
      res.render("overdue_loans_loan", {
        loans: loans,
        books: loans[0].Book,
        patron: loans[0].Patron
      });
    } else {
          console.log(loans.Book);
      res.render("overdue_loans", {
        loans: loans,
        id: req.params.id
      });
    }
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
    if (loans) {
          console.log(loans);
      res.render("checked_loans_loan", {
        loans: loans,
        books: loans[0].Book,
        patrons: loans[0].Patron
      });
    } else {
          console.log(loans.Book);
      res.render("checked_loans", {
        loans: loans,
        id: req.params.id
      });
    }
  });

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
