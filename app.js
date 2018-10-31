//require necessary dependencies
const express = require('express');
const app = express();

//setup static route to server static files in public folder
app.use('/static', express.static('public'));

//set view engine to read pug files in view folder
app.set('view engine', 'pug');

//route to home, rendering home.pug
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/all_books.html', (req, res) => {
  res.render('all_books');
});

app.get('/new_book.html', (req, res) => {
  res.render('new_book');
});

app.get('/overdue_books.html', (req, res) => {
  res.render('overdue_books');
});

app.get('/checked_books.html', (req, res) => {
  res.render('checked_books');
});

app.get('/book_detail.html', (req, res) => {
  res.render('book_detail');
});

app.get('/all_patrons.html', (req, res) => {
  res.render('all_patrons');
});

app.get('/new_patron.html', (req, res) => {
  res.render('new_patron');
});

app.get('/patron_detail.html', (req, res) => {
  res.render('patron_detail');
});

app.get('/all_loans.html', (req, res) => {
  res.render('all_loans');
});

app.get('/new_loan.html', (req, res) => {
  res.render('new_loan');
});

app.get('/overdue_loans.html', (req, res) => {
  res.render('overdue_loans');
});

app.get('/checked_loans.html', (req, res) => {
  res.render('checked_loans');
});

app.get('/return_book.html', (req, res) => {
  res.render('return_book');
});

app.get('/error.html', (req, res) => {
  res.render('error');
});

//start server on localhost port 3000
app.listen(3000, () => {
  console.log('The application is running on localhost:3000!');
})
