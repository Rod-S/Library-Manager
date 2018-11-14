var express = require('express');
var router = express.Router();
var Book = require('../models').Book;

function find(id) {
  var matchedBooks = books.filter(function(book) { return book.id == id; });
  return matchedBooks[0];
};

/* GET book list */
router.get('/', function(req, res, next) {
  Book.findAll().then((books)=> {
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
  res.render('new_book', {book: Book.build(), title: "New Book"});
});

/* get individual book */
router.get('/:id', (req, res, next) => {
  Book.findById(req.params.id).then((book)=> {
    res.render("book_detail", {book: book, title: book.title, author: book.author, genre: book.genre, first_published: book.first_published});
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
