var express = require('express');
var router = express.Router();
var Patron = require('../models').Patron;
var Loan = require('../models').Loan;
var Book = require('../models').Book;
var { Op } = require('sequelize');

/* GET patron list */
router.get('/', function (req, res, next) {
  let searchFilter = req.body.searchFilter;
  Patron.findAll()
  .then((patrons, searchFilter) => {
    res.redirect('/patrons/page_0');
  });
});

/*Pagination route for all patrons listing */
router.get('/page_:page?/:searchFilter?', function(req, res, next) {
  let searchFilter = req.params.searchFilter;
  console.log(searchFilter);
  let page = req.params.page;
  let limit = 5;
  let offset = page * limit;
  console.log(req.params.searchFilter);
  if (req.params.searchFilter) {
    Patron.findAndCountAll({
      attributes: ['id', 'first_name', 'last_name', 'address', 'email', 'library_id', 'zip_code'],
      limit: limit,
      offset: offset,
      $sort: {id: 1},
      where: {
        [Op.or]: [
          {'first_name': {[Op.like]: '%' + searchFilter + '%'}},
          {'last_name': {[Op.like]: '%' + searchFilter+ "%"}},
          {'address': {[Op.like]: '%' + searchFilter+ "%"}},
          {'email': {[Op.like]: '%' + searchFilter+ "%"}},
          {'library_id': {[Op.like]: '%' + searchFilter+ "%"}},
          {'zip_code': {[Op.like]: '%' + searchFilter+ "%"}}
        ]
      }
    })
    .then((patrons) => {
        let pages = Math.ceil(patrons.count / limit);
        offset = limit * (page -1);
        res.render("all_patrons", {
          patrons: patrons.rows,
          count: patrons.count,
          pages: pages,
          searchFilter: searchFilter
        })
    });
  } else {
    Patron.findAndCountAll({
      attributes: ['id', 'first_name', 'last_name', 'address', 'email', 'library_id', 'zip_code'],
      limit: limit,
      offset: offset,
      $sort: {id: 1}
    })
    .then((patrons) => {
        let pages = Math.ceil(patrons.count / limit);
        offset = limit * (page -1);
        res.render("all_patrons", {
          patrons: patrons.rows,
          count: patrons.count,
          pages: pages
        });
    });
  }
});

/* POST submit search */
router.post('/', (req, res, next) => {
  let searchFilter = req.body.searchFilter;
  let page = 0;
  let limit = 5;
  let offset = page * limit;
  if (req.body.searchFilter != '') {
    Patron.findAndCountAll({
      attributes: ['id', 'first_name', 'last_name', 'address', 'email', 'library_id', 'zip_code'],
      limit: limit,
      offset: offset,
      $sort: {id: 1},
      where: {
        [Op.or]: [
          {'first_name': {[Op.like]: '%' + searchFilter + '%'}},
          {'last_name': {[Op.like]: '%' + searchFilter+ "%"}},
          {'address': {[Op.like]: '%' + searchFilter+ "%"}},
          {'email': {[Op.like]: '%' + searchFilter+ "%"}},
          {'library_id': {[Op.like]: '%' + searchFilter+ "%"}},
          {'zip_code': {[Op.like]: '%' + searchFilter+ "%"}}
        ]
      }
    }).then((patrons) => {
      let pages = Math.ceil(patrons.count / limit);
      offset = limit * (page - 1);
      res.render("all_patrons", {
        patrons: patrons.rows,
        count: patrons.count,
        pages: pages,
        searchFilter: searchFilter
      })
    });
  } else {
    res.redirect('/patrons/')
  }
});

/* POST create patron */
router.post('/new', (req, res, next) => {
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
  return Promise.all([
    Patron.findById(req.params.id)
    .then(patrons => patrons),
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
  ])
  .then((patrons) => {
    res.redirect("/patrons/");
  })
  .catch((err) => {
    console.log(err);
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
    }).then((patrons) => {
      console.log(req.body);
      if (patrons[0].Loans[0]) {
        res.render("patron_detail_loan", {
          patrons: patrons,
          loans: patrons[0].Loans,
          errors: err.errors
        });
      } else {
        res.render("patron_detail", {
          patrons: patrons,
          errors: err.errors
        });
      };
    });
  });
});

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
