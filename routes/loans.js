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
    //const resObj = res.json(Loan[0].Book.title);

    //console.log(res.json(Loan));
    //console.log(Loan[0][1]);
    res.render("all_loans", {loans: loans});
  });
});

router.get('/new', function(req, res, next) {
  res.render('new_loan', {loan: Loan.build(), title: "New Loan"});
});

module.exports = router;
