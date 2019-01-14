var express = require('express');
var router = express.Router();
var Patron = require('../models').Patron;
var Loan = require('../models').Loan;
var Book = require('../models').Book;

/* GET patron list */
router.get('/', function (req, res, next) {
  Patron.findAll()
  .then((patrons) => {
    res.render("all_patrons", {patrons: patrons});
  });
});

/* POST create patron */
router.post('/', (req, res, next) => {
  console.log(req.body);
  Patron.create(req.body)
  .then((patron) => {
    res.redirect('/patrons/');
  }).catch((err) => {
    console.log(err);
    if(err.name === "SequelizeValidationError") {
      res.render("new_patron", {
        patron: Patron.build(req.body),
        title: "New Patron",
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch((err) => {
    res.sendStatus(500);
  });
});

/* create a new patron form */
router.get('/new', function(req, res, next) {
  res.render('new_patron', {
    patron: Patron.build(),
    title: "New Patron"
  });
});

/* GET individual patron */
router.get('/:id', function(req, res, next) {
  Patron.findAll({
    where: {'id': req.params.id},
    include: [
      {
        model: Loan,
        include: [
          {
            model: Book
          }
        ]
      }
    ]
  })
  .then((patrons) => {
    console.log(patrons[0].Loans);
    if (patrons[0].Loans[0]) {
      res.render("patron_detail_loan", {
        patrons: patrons,
        loans: patrons[0].Loans
      });
    } else {
      res.render("patron_detail", {patrons: patrons});
    }
  });
});

router.get('/return_book/:id', function(req, res, next){
  Loan.findAll({
    where: {'book_id': req.params.id},
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
    console.log(loans[0].Book);
    res.render("return_book", {loans: loans});
  })
});

router.put('/:id', function(req, res, next) {
  Patron.findById(req.params.id).then((patrons) => {
    Patron.update(
      {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        address: req.body.address,
        email: req.body.email,
        library_id: req.body.library_id,
        zip_code: req.body.zip_code
      }, {
        where: {'id': req.params.id}
      }
    )
  })
  .then((patrons) => {
    res.redirect("/patrons/");
  });
});

/*
router.put('/return_book/:id', function(req, res, next) {
  Loan.findAll({
    where: {'book_id': req.params.id},
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
    Loan.update(
      {
      returned_on: req.body.returned_on
    }, {
      where: {'book_id': req.params.id}
    }
  )
  .then((loans) => {
      res.redirect("/loans/")
    });
  });
});
*/

router.put('/return_book/:id', function(req, res, next) {
  return Promise.all([
    Loan.findAll({
      where: {'book_id': req.params.id},
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
    })
    .then(loans => loans),
      Loan.update(
        {
          returned_on: req.body.returned_on
        }, {
          where: {'book_id': req.params.id}
        }
      )
  ])
  .then((loans) => {
      res.redirect("/loans/")
    }).catch((err) => {
      Loan.findAll({
        where: {'book_id': req.params.id},
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
      console.log(err);
      res.render("return_book", {
        loans: loans,
        errors: err.errors
      })
    })
    });
  });



module.exports = router;
