var express = require('express');
var router = express.Router({mergeParams: true});
var Book = require('../models').Book;
var Loan = require('../models').Loan;
var Patron = require('../models').Patron;
var { Op } = require('sequelize');

/* GET book list */
router.get('/', function(req, res, next) {
  Book.findAll()
  .then((books)=> {
    res.render("all_books", {books: books});
  });
});

/* POST create book */
router.post('/', (req, res, next) => {
  Book.create(req.body)
  .then((book) => {
    res.redirect('/books/');
  })
  .catch((err) => {
    console.log(err);
    if(err.name === 'SequelizeValidationError') {
      res.render("new_book", {
        book: Book.build(req.body),
        title: "New Book",
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch((err) => {
    res.sendStatus(500);
  });
});

/* create a new book form */
router.get('/new', (req, res, next) => {
  res.render('new_book', {
    book: Book.build(),
    title: "New Book"
  });
});

/* GET overdue books */
router.get('/overdue', (req, res, next) => {
  Loan.findAll({
    where: {'returned_on': null, 'return_by': {[Op.lt]: Date() } } ,
    include: [
      {
        model: Book,
        required: true
      }
    ]
  })
  .then((loans)=> {
    if (loans) {
          console.log(loans);
      res.render("overdue_books_loan", {
        loans: loans,
        books: loans[0].Book
      });
    } else {
          console.log(loans.Book);
      res.render("overdue_books", {
        loans: loans,
        id: req.params.id
      });
    }
  });
});

/* GET checked out books */
router.get('/checked_out', (req, res, next) => {

  Loan.findAll({
    where: {'returned_on': null },
    include: [
      {
        model: Book,
        required: true
      }
    ]
  })
  .then((loans)=> {
    if (loans) {
          console.log(loans);
      res.render("checked_books_loan", {
        loans: loans,
        books: loans[0].Book
      });
    } else {
          console.log(loans.Book);
      res.render("checked_books", {
        loans: loans,
        id: req.params.id
      });
    }
  });

});

/* GET individual book */
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
    if (books[0].Loans[0]) {
      res.render("book_detail_loan", {
        books: books,
        loans: books[0].Loans
      });
    } else {
      res.render("book_detail", {
        books: books,
        id: req.params.id
      });
    }
  });
});

/* PUT update book */
/*
router.put('/:id', (req, res, next) => {
  Book.findById(req.params.id)
  .then((books) => {
    Book.update(
      {
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        first_published: req.body.first_published
      }, {
        where: {'id': req.params.id}
      }
    )
  })
  .then((books) => {
    res.redirect("/books/" + req.params.id);
  })
  .catch((err) => {
    console.log(err);
    if(err.name === 'SequelizeValidationError') {
      if (books[0].Loans[0]) {
        res.render("book_detail_loan", {
          book: Book.build(req.body),
          books: loans[0].Book,
          loans: loans,
          errors: err.errors
        });
      }
      else if (!books[0].Loans[0]) {
        res.render("book_detail", {
          book: Book.build(req.body),
          books: books,
          id: req.params.id,
          errors: err.errors
        })
      };
    } else {
      throw err;
    }
  }).catch((err) => {
    res.sendStatus(500);
  });
});
*/

router.put('/:id', (req, res, next) => {
  return Promise.all([
    Book.findById(req.params.id)
    .then(books => books),
      Book.update(
        {
          title: req.body.title,
          author: req.body.author,
          genre: req.body.genre,
          first_published: req.body.first_published
        }, {
          where: {'id': req.params.id}
        }
      )
  ])
  .then((books) => {
    res.redirect("/books/");
  })
  .catch((err) => {
    console.log(err);
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
      console.log(req.body);
      if (books[0].Loans[0]) {
        res.render("book_detail_loan", {
          book: Book.build(req.body),
          books: books,
          loans: books[0].Loans,
          errors: err.errors
        });
      }
      if (!books[0].Loans[0]) {
        res.render("book_detail", {
          book: Book.build(req.body),
          books: books,
          id: req.params.id,
          errors: err.errors
        })
      };
    })
  })
});



module.exports = router;
