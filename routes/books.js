var express = require('express');
var router = express.Router();
var Book = require('../models').Book;
var Loan = require('../models').Loan;
var Patron = require('../models').Patron;


/* GET book list */
router.get('/', function(req, res, next) {
  Book.findAll()
  .then((books)=> {
    res.render("all_books", {books: books});
  });
});

/* POST create book */
router.post('/', (req, res, next) => {
  console.log(req.body);
  Book.create(req.body)
  .then((book) => {
    res.redirect('/books/');
  });
});

/* create a new book form */
router.get('/new', (req, res, next) => {
  res.render('new_book', {
    book: Book.build(),
    title: "New Book"
  });
});

/* get individual book */
router.get('/:id', (req, res, next) => {
  Book.findAll({
    where: {'id': req.params.id},
    include: [
      {
        model: Loan,
        include: [
          {
            model: Patron
          }
        ]
      }
    ]
  })
  .then((books)=> {
    if (books[0].Loans[0]) {res.render("book_detail_loan", {books: books})}
    else {res.render("book_detail", {books: books})}
    });
});

/* PUT update book */
router.post("/:id", (req, res, next) => {
  console.log(req.body);
  Book.update(
    {
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      first_published: req.body.first_published
    },
    {where: {id: req.params.id}}
  )
  .then((book) => {
    res.redirect("/books/");
  });
});



module.exports = router;
