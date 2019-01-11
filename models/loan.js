'use strict';
module.exports = (sequelize, DataTypes) => {
  const Loan = sequelize.define('Loan', {
    book_id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Book is required"
        }
      }
    },
    patron_id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Patron is required"
        }
      }
    },
    loaned_on: {
      type: DataTypes.DATEONLY,
      validate: {
        notEmpty: {
          msg: "Loaned on date is required"
        }
      }
    },
    return_by: {
      type: DataTypes.DATEONLY,
      validate: {
        notEmpty: {
          msg: "Return by is required"
        }
      }
    },
    returned_on: DataTypes.DATEONLY
  }, {});
  Loan.associate = function(models) {
    // associations can be defined here
      Loan.belongsTo(models.Book, {foreignKey: "book_id"});
      Loan.belongsTo(models.Patron, {foreignKey: "patron_id"});
      //raw query
      //SELECT title AS Book, first_name ||' '|| last_name AS Patron, loaned_on AS "Loaned on", return_by AS "Return by", returned_on AS "Returned on" FROM loans INNER JOIN books ON loans.book_id = books.id INNER JOIN patrons ON loans.patron_id = patrons.id;

  };
  return Loan;
};
