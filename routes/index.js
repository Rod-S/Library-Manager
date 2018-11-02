var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

/* GET all_books page. */
router.get('/all_books.html', (req, res, next) => {
  res.render('all_books');
});

router.get('/new_book.html', (req, res) => {
  res.render('new_book');
});

router.get('/overdue_books.html', (req, res) => {
  res.render('overdue_books');
});

router.get('/checked_books.html', (req, res) => {
  res.render('checked_books');
});

router.get('/book_detail.html', (req, res) => {
  res.render('book_detail');
});

router.get('/all_patrons.html', (req, res) => {
  res.render('all_patrons');
});

router.get('/new_patron.html', (req, res) => {
  res.render('new_patron');
});

router.get('/patron_detail.html', (req, res) => {
  res.render('patron_detail');
});

router.get('/all_loans.html', (req, res) => {
  res.render('all_loans');
});

router.get('/new_loan.html', (req, res) => {
  res.render('new_loan');
});

router.get('/overdue_loans.html', (req, res) => {
  res.render('overdue_loans');
});

router.get('/checked_loans.html', (req, res) => {
  res.render('checked_loans');
});

router.get('/return_book.html', (req, res) => {
  res.render('return_book');
});

module.exports = router;
