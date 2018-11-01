'use strict';
module.exports = (sequelize, DataTypes) => {
  const book = sequelize.define('book', {
    id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    genre: DataTypes.STRING,
    first_published: DataTypes.INTEGER
  }, {});
  book.associate = function(models) {
    // associations can be defined here
  };
  return book;
};
