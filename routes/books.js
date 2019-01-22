//import modules, sequelize models

var express = require('express');
var router = express.Router({mergeParams: true});
var Book = require('../models').Book;
var Loan = require('../models').Loan;
var Patron = require('../models').Patron;
var { Op } = require('sequelize');

/* GET book list */
router.get('/', function(req, res, next) {
  let searchFilter = req.body.searchFilter;
  Book.findAll()
  .then((books, searchFilter)=> {
    res.redirect('/books/page_0');
  }).catch((err) => {
    res.sendStatus(500);
  });
});

/*Pagination route for all books listing */
router.get('/page_:page?/:searchFilter?', (req, res, next) => {
  let searchFilter = req.params.searchFilter;
  let page = req.params.page;
  let limit = 5;
  let offset = page * limit;
  //run if search is being used
  if (req.params.searchFilter) {
    Book.findAndCountAll({
      attributes: ['id', 'title', 'author', 'genre', 'first_published'],
      limit: limit,
      offset: offset,
      $sort: {id: 1},
      where: {
        [Op.or]: [
          {'title': {[Op.like]: '%' + searchFilter + '%'}},
          {'author': {[Op.like]: '%' + searchFilter+ "%"}},
          {'genre': {[Op.like]: '%' + searchFilter+ "%"}},
          {'first_published': {[Op.like]: '%' + searchFilter+ "%"}}
        ]
      }
    })
    //load all_books HTML
    .then((books)=> {
      let pages = Math.ceil(books.count / limit);
      offset = limit * (page - 1);
      res.render("all_books", {
        books: books.rows,
        count: books.count,
        page: page,
        pages: pages,
        searchFilter: searchFilter
      });
    }).catch((err) => {
      res.sendStatus(500);
    });
  //run if not searching
  } else {
    Book.findAndCountAll({
      attributes: ['id', 'title', 'author', 'genre', 'first_published'],
      limit: limit,
      offset: offset,
      $sort: {id: 1}
    })
    //load all_books HTML
    .then((books)=> {
      let pages = Math.ceil(books.count / limit);
      offset = limit * (page - 1);
      res.render("all_books", {
        books: books.rows,
        count: books.count,
        page: page,
        pages: pages
      });
    }).catch((err) => {
      res.sendStatus(500);
    });
  }
});

/* POST submit search */
router.post('/', (req, res, next) => {
  let searchFilter = req.body.searchFilter;
  let page = 0;
  let limit = 5;
  let offset = page * limit;
  //if search results aren't blank
  if (req.body.searchFilter != '') {
    Book.findAndCountAll({
      attributes: ['id', 'title', 'author', 'genre', 'first_published'],
      limit: limit,
      offset: offset,
      $sort: {id: 1},
      where: {
        [Op.or]: [
          {'title': {[Op.like]: '%' + searchFilter + '%'}},
          {'author': {[Op.like]: '%' + searchFilter + "%"}},
          {'genre': {[Op.like]: '%' + searchFilter + "%"}},
          {'first_published': {[Op.like]: '%' + searchFilter + "%"}}
        ]
      }
    }).then((books) => {
      let pages = Math.ceil(books.count / limit);
      offset = limit * (page - 1);
      res.render("all_books", {
        books: books.rows,
        count: books.count,
        page: page,
        pages: pages,
        searchFilter: searchFilter
      })
    }).catch((err) => {
      res.sendStatus(500);
    });
  } else {
    res.redirect('/books/')
  }
});

/* POST create book */
router.post('/new', (req, res, next) => {
  Book.create(req.body)
  .then((book) => {
    res.redirect('/books/');
  })
  .catch((err) => {
    //render new_book HTML with validation errors
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
    //if loan history exists, load overdue_books_loan HTML
    if (loans) {
      res.render("overdue_books_loan", {
        loans: loans,
        books: loans[0].Book
      });
    //if no loan history exists, load over_books HTML
    } else {
      res.render("overdue_books", {
        loans: loans,
        id: req.params.id
      });
    }
  }).catch((err) => {
    res.sendStatus(500);
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
    //if loan history exists, load checked_books_loan
    if (loans) {
      res.render("checked_books_loan", {
        loans: loans,
        books: loans[0].Book
      });
    //if no loan history exists, load checked_books
    } else {
      res.render("checked_books", {
        loans: loans,
        id: req.params.id
      });
    }
  }).catch((err) => {
    res.sendStatus(500);
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
    //if loan history exists, load book_detail_loan
    if (books[0].Loans[0]) {
      res.render("book_detail_loan", {
        books: books,
        loans: books[0].Loans
      });
    //if no loan history exists, load book_detail
    } else {
      res.render("book_detail", {
        books: books,
        id: req.params.id
      });
    }
  }).catch((err) => {
    res.sendStatus(500);
  });
});

/* PUT update individual book details */
router.put('/:id', (req, res, next) => {
  //returned promise to allow nested then() chains
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
  //if update unsuccessful, load book_detail HTML with validation errors
  .catch((err) => {
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
      //if loan history exists, load book_detail_loan HTML
      if (books[0].Loans[0]) {
        res.render("book_detail_loan", {
          book: Book.build(req.body),
          books: books,
          loans: books[0].Loans,
          errors: err.errors
        });
      }
      //if no loan history exists, load book_detail HTML
      if (!books[0].Loans[0]) {
        res.render("book_detail", {
          book: Book.build(req.body),
          books: books,
          id: req.params.id,
          errors: err.errors
        })
      };
    }).catch((err) => {
      res.sendStatus(500);
    });
  })
});



module.exports = router;
