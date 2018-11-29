'use strict';
module.exports = (sequelize, DataTypes) => {
  const Loan = sequelize.define('Loan', {
    book_id: DataTypes.INTEGER,
    patron_id: DataTypes.INTEGER,
    loaned_on: DataTypes.DATEONLY,
    return_by: DataTypes.DATEONLY,
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
