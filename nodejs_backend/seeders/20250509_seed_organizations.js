// seeders/20250509_seed_organizations.js
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Organization', [
            { name: 'Organization A', createdAt: new Date(), updatedAt: new Date() },
            { name: 'Organization B', createdAt: new Date(), updatedAt: new Date() },
            { name: 'Organization C', createdAt: new Date(), updatedAt: new Date() }
        ]);
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Organization', null, {});
    }
};