module.exports = (sequelize, Sequelize) => {
    const Review = sequelize.define("Review", {
      reviewID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      score: {
        type: Sequelize.INTEGER,
        min: 1,
        max: 5
      },
      comment: {
        type: Sequelize.TEXT
      },
      reviewType: {
        type: Sequelize.ENUM('user', 'listing')
      }
    }, {
      timestamps: true,
      freezeTableName: true,
    });
    return Review;
  };