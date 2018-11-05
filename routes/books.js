var express = require('express');
var router = express.Router();
var Book = require('../models').book;

var books = [];

router.get('/books/new', function(req, res, next) {
  res.render('new_book', {book: Book.build(), title:})
});
