var express = require('express');
var router = express.Router();
var Loan = require('../models').Loan;
var Book = require('../models').Book;

function bookName(book_id) {
  var matchedName = books.filter(function(book) {return book.id == book_id;});
  return matchedBooks[0];
};



/* GET loan list */
router.get('/', function(req, res, next) {

  Loan.findAll({include: [{ all: true }] })
  .then((loans, book, books, Book)=> {
    res.render("all_loans", {loans: loans, title: loan.book.title});
  });

});

router.get('/new', function(req, res, next) {
  res.render('new_loan', {loan: Loan.build(), title: "New Loan"});
});

module.exports = router;
