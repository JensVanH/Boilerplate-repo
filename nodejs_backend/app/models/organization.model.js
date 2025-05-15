module.exports = (sequelize, Sequelize) => {
    const Organization = sequelize.define("Organization", {
        organizationID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        timestamps: true,
        freezeTableName: true,
    });

    return Organization;
};
