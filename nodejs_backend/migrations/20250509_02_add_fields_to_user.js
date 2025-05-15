// migrations/20250509_add_fields_to_user.js
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('User', 'role', {
            type: Sequelize.ENUM('user', 'verifier'),
            allowNull: false,
            defaultValue: 'user'
        });
        await queryInterface.addColumn('User', 'organizationID', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'Organization',
                key: 'organizationID'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('User', 'role');
        await queryInterface.removeColumn('User', 'organizationID');
    }
};