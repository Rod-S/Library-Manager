var express = require('express');
var router = express.Router();
var Book = require('../models').Book;


/* GET articles listing. */
router.get('/', function(req, res, next) {
  res.render("all_books");
});


/* POST create book. */

router.post('/', (req, res, next) => {
  Book.create(

  )
  .then((book) => {
    res.redirect('/books/new');
  });
});

/*create a new book form */
router.get('/new', (req, res, next) => {
  res.render('new_book', {book: Book.build(), title: "New Book"});
});

module.exports = router;
