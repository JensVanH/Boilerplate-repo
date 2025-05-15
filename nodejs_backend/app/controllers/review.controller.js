const db = require("../models");
const sequelize = require('sequelize');
const Review = db.Review;
const Transaction = db.Transaction;
const Listing = db.Listing;
const User = db.User;

/** post a review
 * expected query param:
 * @param id transactionID 
 * expected params in body:
 * @param score [1-5]
 * @param comment
 */
exports.postReview = (req, res) => {
    Transaction.findOne({
        where: {
            transactionID: req.query.id,
        },
        include: {
            model: Listing,
            attributes: ['userID']
        }
    }).then(Transaction => {
        // catch errors
        if (!Transaction)
            return res.status(404).send({ message: "Invalid transactionID or transaction is not yet reviewable" });
        if (req.userId !== Transaction.Listing.userID && req.userId !== Transaction.customerID)
            return res.status(401).send({ message: "Only customer and provider of transaction can post a transaction" })
        if (!(req.body.score >1 && req.body.score <= 5))
            return res.status(400).send({ message: "Score must be in range [1,5]" })
        Review.findOne({
            where: {
                transactionID: Transaction.transactionID,
                reviewType: req.userId === Transaction.customerID ? 'listing' : 'user',
            }
        }).then(r => {
            if (r)
                return res.status(400).send({ message: "You can only leave 1 review"})
            Review.create({
                score: req.body.score,
                comment: req.body.comment,
                reviewType: req.userId === Transaction.customerID ? 'listing' : 'user',
                transactionID: Transaction.transactionID
            }).then(() => {
                res.send({ message: "Review was posted successfully!", listingID: Transaction.listingID });
            }).catch(err => {
                res.status(500).send({ message: err.message});
            });
        })
    })
}

/** get all reviews on listing
 * expected query param:
 * @param id listingID 
 */
exports.getListingReviews = (req, res) => {
    Review.findAll({
        include: {
            model: Transaction,
            include: {
                model: User,
                attributes: ['userName', 'profilePicture']
            },
            attributes: ['listingID', 'customerID']
        },
        where: {
            reviewType: 'listing',
            '$Transaction.listingID$': req.query.id
        },
        attributes: ['reviewID', 'score', 'comment', 'Transaction.User.userName']
    }).then(r => {
        // send data
        return res.status(200).send({reviews: r, score: getAvgScore(r)})
    }).catch(err => {
        res.status(500).send({ message: err.message});
    });
}

/** get all reviews on user
 * expected query param:
 * @param id userID 
 */
exports.getUserReviews = (req, res) => {
    Review.findAll({
        include: {
            model: Transaction,
            attributes: ['customerID']
        },
        where: {
            reviewType: 'user',
            '$Transaction.customerID$': req.query.id
        }
    }).then(r => {
        // send data
        return res.status(200).send({reviews: r, score: getAvgScore(r)})
    }).catch(err => {
        res.status(500).send({ message: err.message});
    });
}

// calculates average score of all reviews
function getAvgScore(obj){
    return [obj.map(x => x.score).reduce((m, x) => {
            m[0] += 1
            m[1] += x
            return m
        }, [0, 0])].map(x => x[1] / x[0] || 0)[0]
}