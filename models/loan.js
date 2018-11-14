'use strict';
module.exports = (sequelize, DataTypes) => {
  const Loan = sequelize.define('Loan', {
    book_id: DataTypes.INTEGER,
    patron_id: DataTypes.INTEGER,
    loaned_on: DataTypes.DATE,
    return_by: DataTypes.DATE,
    returned_on: DataTypes.DATE
  }, {});
  Loan.associate = function(models) {
    // associations can be defined here
      Loan.belongsTo(models.Book, {foreignKey: "book_id"});
      //SELECT title AS Book, first_name ||' '|| last_name AS Patron, loaned_on AS "Loaned on", return_by AS "Return by", returned_on AS "Returned on" FROM loans INNER JOIN books ON loans.book_id = books.id INNER JOIN patrons ON loans.patron_id = patrons.id;

  };
  return Loan;
};
