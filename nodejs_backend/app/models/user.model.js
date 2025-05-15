module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("User", {
        userID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        firstName: {
            type: Sequelize.STRING
        },
        lastName: {
            type: Sequelize.STRING
        },
        organisation: {
            type: Sequelize.STRING
        },
        authID: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            isEmail: true
        },
        userName: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        gender: {
            type: Sequelize.STRING(7)
        },
        address: {
            type: Sequelize.STRING
        },
        birthDate: {
            type: Sequelize.DATEONLY
        },
        phoneNumber: {
            type: Sequelize.STRING(20)
        },
        profilePicture: {
            type: Sequelize.TEXT('long')
        },
        superUser: {
            type: Sequelize.BOOLEAN
        },
        role: {
            type: Sequelize.ENUM('user', 'verifier'),
            allowNull: false,
            defaultValue: 'user'
        },
        organizationID: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'Organization',
                key: 'organizationID'
            }
        }
    }, {
        timestamps: true,
        freezeTableName: true,
    });

    return User;
};
