const db = require("../models");
const Transaction = db.Transaction;
const Listing = db.Listing;
const User = db.User;
const Notification = db.Notification;
const Review = db.Review;
const sequelize = db.sequelize;
const Booking = db.Booking;

/** get all transactions on a given listingid
 * expected Query param:
 * @param id listingID 
 */
exports.getListingTransactions = (req, res) => {
    // find listing
    Listing.findOne({
        where: {
            listingID: req.query.id
        },
    }).then(Listing => {
        // catch errors
        if (!Listing)
            return res.status(404).send({ message: "Invalid listingID" });
        if (Listing.userID !== req.userId)
            return res.status(401).send({ message: "Unauthorized to view another user's transactions on his listings"});
        // find all transactions
        Transaction.findAll({
            where: {
                listingID: Listing.listingID
            },
            // include userdata (when user has no firstName and lastName use email as name)
            include: {model: User, attributes: ['userID', 'userName', 'email', 'address']},
            order: [['transactionID', 'DESC']],
        }).then(t => {
            checkReviewable(t, 'user', res);
        })
    })
};

exports.getTransaction = (req, res) => {
    // const transactionID = req.query.transactionID;
    const transactionID = req.query.transactionID;
    // Find transaction with the provided transactionID
    Transaction.findOne({
      where: {
        transactionID: transactionID
      },
      include: [
        {
          model: Listing,
          attributes: ['name', 'description', 'file', 'link']
        }
      ]
    })
      .then(transaction => {
        // Check if the transaction exists
        if (!transaction) {
          return res.status(404).send({ message: 'Invalid transactionID' });
        }
  
        // Check if the transaction belongs to the user
        // if (transaction.Listing.userID !== req.userId) {
        //   return res
        //     .status(401)
        //     .send({ message: "Unauthorized to view another user's transactions on his listings" });
        // }
  
        // Process the transaction data
        const { price, time, status, Listing: listing } = transaction;
        const { name, description, file, link } = listing;
  
        // Prepare the response object
        const result = {
          transactionID,
          price,
          time,
          status,
          listing: {
            name,
            description,
            file,
            link
          }
        };
  
        // Send the response
        res.status(200).send(result);
      })
      .catch(err => {
        console.error('Error:', err);
        res.status(500).send({ message: err.message });
      });
  };

// get all transactions made by given user
exports.getUserTransactions = (req, res) => {
    // console.log(req.query.company)
    Transaction.findAll({
        where: {
            customerID: req.userId // get user from webtoken
            
        },
        // include listingdata
        include: {
            model: Listing, 
            attributes: ['listingID', 'name', 'availableAssets', 'date', 'price', 'picture', 'userID', 'link'],
            where: {
                company: req.query.company
            }},
        order: [['time', 'DESC']],
        
    }).then(t => {
        checkReviewable(t, 'listing', res);
    })
};

function checkReviewable(transactions, reviewType, res){
    if (transactions.length === 0)
        return res.status(200).send({transactions: []});
    let checkedTransactions = [];
    transactions.forEach(x => {
        Review.findOne({
            where: {
                transactionID: x.transactionID,
                reviewType: reviewType
            }
        }).then(r => {
            x.dataValues['reviewable'] = !Boolean(r) && Math.ceil((Date.now() - x.time) / (1000 * 60 * 60 * 24)) >= 10;
            checkedTransactions.push(x);
            if (checkedTransactions.length == transactions.length)
                res.status(200).send({transactions: checkedTransactions});
        })
    });
}

/** creates transaction
 * expected params in body:
 * @param listingID
 * @param numberOfAssets
 */
exports.createTransaction = (req, res) => {
    // find listing
    Listing.findOne({
        where: {
            listingID: req.body.listingID
        }
    }).then(Listing => {
        // catch errors
        if (!Listing)
            return res.status(404).send({ message: "Invalid listingID" });
        // if (!req.body.numberOfAssets)
        //     return res.status(400).send({ message: "Number of assets not given" });
        // if (Listing.availableAssets && Listing.availableAssets < req.body.numberOfAssets)
        //     return res.status(400).send({ message: "Not enough assets available" });
        if (req.userId === Listing.userID)
            return res.status(401).send({ message: "Can't make a transaction on your own listing" })
        if (Listing.status === 'cancelled')
            return res.status(400).send({ message : "Can't make a transaction on a cancelled listing" })
        // create transaction
        Transaction.create({
            numberOfAssets: req.body.numberOfAssets,
            sendAddress: req.body.address,
            price: Listing.price * (req.body.numberOfAssets ? parseInt(req.body.numberOfAssets) : 1),
            customerID: req.userId, // get user from webtoken
            status: 'reserved',
            listingID: Listing.listingID,
            date: req.body.date,
            time: req.body.time
        }).then(t => {
            // update listing's available assets
            if (Listing.availableAssets)
                Listing.availableAssets -= t.numberOfAssets;
            Notification.create({
                transactionID: t.transactionID,
                viewed: false,
                userID: Listing.userID,
                type: 'new transaction'
            })
            Notification.create({
                transactionID: t.transactionID,
                viewed: false,
                userID: req.userId,
                type: 'reviewable',
                activeAt: sequelize.literal('NOW() + INTERVAL 10 day')
            })
            Listing.save().then(() => {
                res.send({ message: "Transaction was created successfully!", customerID: t.customerID, transactionID: t.transactionID });
            })
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
    })
}

/** cancels transaction (doesn't delete)
 * expected query param:
 * @param id transactionID 
 */
exports.cancelTransaction = (req, res) => {
    // find transaction
    Transaction.findOne({
        where: {
            transactionID: req.query.id
        },
        // include userID extracted from listing
        include: {model: Listing, attributes: ['userID']},
    }).then(Transaction => {
        // catch errors
        if (!Transaction)
            return res.status(404).send({ message: "Invalid transactionID" });
        // compare user from webtoken with data
        if (req.userId !== Transaction.customerID && req.userId !== Transaction.Listing.userID) 
            return res.status(401).send({ message: "Unauthorized to cancel transaction"});
        // find listing
        Listing.findOne({
            where: {
                listingID: Transaction.listingID
            }
        }).then(Listing => {
            // catch error
            if (!Listing)
                return res.status(404).send({ message: "Transaction has invalid listingID" });

            // update listing's available assets
            if (Listing.availableAssets)
                Listing.availableAssets += Transaction.numberOfAssets;
            Listing.save().then(_ => {
                // update transaction status
                Transaction.status = 'cancelled';

                Booking.destroy({
                    where: {
                      transactionID: Transaction.transactionID
                    }
                });

                Notification.create({
                    transactionID: Transaction.transactionID,
                    viewed: false,
                    userID: req.userId === Listing.userID ? Transaction.customerID : Listing.userID,
                    type: 'cancellation'
                }).then(() => 
                    Transaction.save().then(_ => {
                        res.send({ message: "Transaction was cancelled successfully!" });
                    })
                )
                
            })
        })
    })
}

/** confirm payment of transaction
 * expected query param:
 * @param id transactionID 
 */
exports.confirmPayment = (req, res) => {
    // find transaction
    Transaction.findOne({
        where: {
            transactionID: req.query.id
        },
        // include userID extracted from listing
        include: {model: Listing, attributes: ['userID']},
    }).then(Transaction => {
        // catch errors
        if (!Transaction)
            return res.status(404).send({ message: "Invalid transactionID" });
        // compare user from webtoken with data 
        if (req.userId !== Transaction.Listing.userID)
            return res.status(401).send({ message: "Unauthorized to confirm payment"});
        // update transaction's status
        Transaction.status = 'payed';
        Notification.create({
            transactionID: Transaction.transactionID,
            viewed: false,
            userID: Transaction.customerID,
            type: 'payment confirmation'
        })
        Transaction.save().then(_ => {
            res.send({ message: "Payment was confirmed successfully!" });
        }) 
    })
}