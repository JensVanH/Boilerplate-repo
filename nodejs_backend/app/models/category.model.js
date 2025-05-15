module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define("Category", {
      name: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      type: {
        type: Sequelize.STRING,
      },
      company: {
        type: Sequelize.STRING
      }
    }, {
      timestamps: true,
      freezeTableName: true,
    });
  
    return Category;
  };