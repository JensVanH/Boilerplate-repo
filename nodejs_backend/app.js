const express = require("express");
const cors = require("cors");
const PORT = 3001;

const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json({ limit: '5mb' }));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


const db = require("./app/models");

(async function() {
  await db.sequelize.sync({alter:true});  // This ensures your database schema is up-to-date
  await seedData();
})();

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/listing.routes')(app);
require('./app/routes/transaction.routes')(app);
require('./app/routes/category.routes')(app);
require('./app/routes/notification.routes')(app);
require('./app/routes/review.routes')(app);
require('./app/routes/taxonomy.routes')(app);
require('./app/routes/company.routes')(app);
require('./app/routes/message.routes')(app);
require('./app/routes/booking.routes')(app);
require('./app/routes/organization.routes')(app);
require('./app/routes/verifier.routes')(app);








// listen for requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});




async function seedData() {
  const dimensions = [
    { name: 'User Type', orderNr: 1, mandatory: true, description: 'The users on the platform can be either individual persons or organizations, or sometimes both.' },
    { name: 'Time Unit', orderNr: 5, mandatory: false, description: null },
    { name: 'Review By', orderNr: 10, mandatory: false, description: 'By Customers allows Customers the option to leave reviews about the listings they interacted with. These reviews reflect their experiences, satisfaction levels, and opinions about the product or service received...' },
    { name: 'Review Of', orderNr: 11, mandatory: false, description: 'By Customers allows Customers the option to leave reviews about the listings they interacted with. These reviews reflect their experiences, satisfaction levels, and opinions about the product or service received...' },
    { name: 'Revenue Stream', orderNr: 13, mandatory: false, description: 'A revenue stream is the income generated for a company or organization...' },
    { name: 'Revenue Source', orderNr: 14, mandatory: false, description: 'Customer Revenue: This refers to the income generated directly...' },
    { name: 'Quantity', orderNr: 6, mandatory: true, description: 'When we talk about quantity in relation to a listing or product...' },
    { name: 'Price Discovery', orderNr: 7, mandatory: false, description: 'On a marketplace, the price of a listing can be determined in various ways...' },
    { name: 'Price Calculation', orderNr: 8, mandatory: false, description: 'The price can be calculated based on the quantity selected by the customer...' },
    { name: 'Payment System', orderNr: 12, mandatory: false, description: null },
    { name: 'Listing Type', orderNr: 3, mandatory: true, description: 'A good can be either physical (like a book or a smartphone) or digital (like software or an e-book)...' },
    { name: 'Listing Kind', orderNr: 2, mandatory: true, description: 'Physical Goods: These are tangible products that can be physically handled and shipped to customers...' },
    { name: 'Frequency', orderNr: 4, mandatory: false, description: 'The term "frequency" indicates how often a service occurs...' },
    { name: 'Conversation System', orderNr: 9, mandatory: false, description: 'A listings conversation allows potential customers to send messages...' },
    // New Dimensions:
    { name: 'Listing Verification Mechanism', orderNr: 15, mandatory: true, description: 'Specifies the mechanism of verification for listings.' },
    { name: 'Listing Verifier Type', orderNr: 16, mandatory: false, description: 'Specifies the type of external verification.' }
  ];

  const dimensionValues = [
    { name: 'Auction', orderNr: 3, dimension: 'Price Calculation', exclusive: true },
    { name: 'By Customer', orderNr: 1, dimension: 'Review By' },
    { name: 'Of Listing', orderNr: 1, dimension: 'Review Of' },
    { name: 'Of Provider', orderNr: 2, dimension: 'Review Of' },
    { name: 'Of Customer', orderNr: 3, dimension: 'Review Of' },
    { name: 'By Feature', orderNr: 2, dimension: 'Price Calculation' },
    { name: 'By Provider', orderNr: 2, dimension: 'Review By' },
    { name: 'By Quantity', orderNr: 1, dimension: 'Price Calculation' },
    { name: 'Commission', orderNr: 2, dimension: 'Revenue Stream' },
    { name: 'Customer', orderNr: 1, dimension: 'Revenue Source' },
    { name: 'Day', orderNr: 2, dimension: 'Time Unit' },
    { name: 'Digital Good', orderNr: 2, dimension: 'Listing Type' },
    { name: 'Digital Service', orderNr: 4, dimension: 'Listing Type' },
    { name: 'Fixed Fee', orderNr: 3, dimension: 'Revenue Stream' },
    { name: 'Good Transfer', orderNr: 1, dimension: 'Listing Kind' },
    { name: 'Hour', orderNr: 1, dimension: 'Time Unit' },
    { name: 'Listing Conversation', orderNr: 1, dimension: 'Conversation System' },
    { name: 'Listing Fee', orderNr: 4, dimension: 'Revenue Stream' },
    { name: 'Many', orderNr: 2, dimension: 'Quantity', exclusive: true },
    { name: 'Offline Service', orderNr: 3, dimension: 'Listing Type' },
    { name: 'One', orderNr: 1, dimension: 'Quantity', exclusive: true },
    { name: 'One-Time', orderNr: 3, dimension: 'Frequency', exclusive: true },
    { name: 'Organisation', orderNr: 2, dimension: 'User Type' },
    { name: 'Person', orderNr: 1, dimension: 'User Type' },
    { name: 'Physical Good', orderNr: 1, dimension: 'Listing Type' },
    { name: 'Provider', orderNr: 2, dimension: 'Revenue Source' },
    { name: 'Quote', orderNr: 4, dimension: 'Price Calculation', exclusive: true },
    { name: 'Recurring', orderNr: 4, dimension: 'Frequency', exclusive: true },
    { name: 'Service', orderNr: 2, dimension: 'Listing Kind' },
    { name: 'Set by Customer', orderNr: 2, dimension: 'Price Discovery', exclusive: true },
    { name: 'Set by Market', orderNr: 3, dimension: 'Price Discovery', exclusive: true },
    { name: 'Set by Provider', orderNr: 1, dimension: 'Price Discovery', exclusive: true },
    { name: 'Subscription', orderNr: 1, dimension: 'Revenue Stream' },
    { name: 'Transaction Conversation', orderNr: 2, dimension: 'Conversation System' },
       // New Values for Listing Verification Mechanism
    { name: 'Internal Verification', orderNr: 1, dimension: 'Listing Verification Mechanism', exclusive: true },
    { name: 'External Verification', orderNr: 2, dimension: 'Listing Verification Mechanism', exclusive: true },

    // New Values for Listing Verifier Type
    { name: 'Individual Expert', orderNr: 1, dimension: 'Listing Verifier Type', exclusive: true },
    { name: 'Organizational Verifier', orderNr: 2, dimension: 'Listing Verifier Type', exclusive: true },
    { name: 'Community-based', orderNr: 3, dimension: 'Listing Verifier Type', exclusive: true }
  ];

  const constraints = [
    { value: 'Set by Customer', constraintsvalue: 'Auction' },
    { value: 'Set by Provider', constraintsvalue: 'Auction' },
    { value: 'One', constraintsvalue: 'By Feature' },
    { value: 'Set by Market', constraintsvalue: 'By Feature' },
    { value: 'One', constraintsvalue: 'By Quantity' },
    { value: 'Set by Market', constraintsvalue: 'By Quantity' },
    { value: 'Listing Fee', constraintsvalue: 'Customer' },
    { value: 'Service', constraintsvalue: 'Digital Good' },
    { value: 'Good Transfer', constraintsvalue: 'Digital Service' },
    { value: 'Good Transfer', constraintsvalue: 'Offline Service' },
    { value: 'Good Transfer', constraintsvalue: 'One-Time' },
    { value: 'Service', constraintsvalue: 'Physical Good' },
    { value: 'Set by Customer', constraintsvalue: 'Quote' },
    { value: 'Set by Provider', constraintsvalue: 'Quote' },
    { value: 'Good Transfer', constraintsvalue: 'Recurring' },
    { value: 'Good Transfer', constraintsvalue: 'Hour' },
    { value: 'Good Transfer', constraintsvalue: 'Day' },
    { value: 'One-Time', constraintsvalue: 'Of Listing' },
    // New constraints for Listing Verification Mechanism and Listing Verifier Type
    { value: 'Internal Verification', constraintsvalue: 'Individual Expert' },
    { value: 'Internal Verification', constraintsvalue: 'Organizational Verifier' },
    { value: 'Internal Verification', constraintsvalue: 'Community-based' },
];


for (const dim of dimensions) {
  db.Dimension.findOrCreate({
    where: { name: dim.name },
    defaults: dim
  });
}

for (const dimVal of dimensionValues) {
  db.DimensionValue.findOrCreate({
    where: { name: dimVal.name }, 
    defaults: dimVal
  });
}

for (const con of constraints) {
  db.ConstraintValue.findOrCreate({
    where: { 
      value: con.value,
      constraintsValue: con.constraintsvalue}, 
    defaults: con
  });
}
console.log("Data seeded successfully");
}