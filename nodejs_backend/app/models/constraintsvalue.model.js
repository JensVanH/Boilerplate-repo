module.exports = (sequelize, Sequelize) => {
    const ConstraintValue = sequelize.define("ConstraintValue", {
      // Foreign key to the DimensionValue table for the 'value' field
      value: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'DimensionValue', // Table name of the referenced model
          key: 'name', // Column name of the referenced field
        },
      },
      // Foreign key to the DimensionValue table for the 'constraintsValue' field
      constraintsValue: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'DimensionValue', // Table name of the referenced model
          key: 'name', // Column name of the referenced field
        },
      },
    }, {
      timestamps: true,
      freezeTableName: true,
    });
  
    return ConstraintValue;
  };