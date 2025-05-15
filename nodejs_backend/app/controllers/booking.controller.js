const db = require("../models");
const Booking = db.Booking;
const Transaction = db.Transaction;
const Listing = db.Listing;
const Op = db.Sequelize.Op
const sequelize = db.sequelize;

/** get booking
 * expected Query param:
 * @param id bookingID 
 */
exports.getBooking = (req, res) => {
    Booking.findOne({
        where: {
            bookingID: req.query.id
        },
        include: [
            {
              model: Transaction,
              include: [
                {
                    model: Listing,
                    attributes: ['userID']
                }],
              attributes: ['customerID']
            }
          ]
    }).then(booking => {
        if (!booking)
            return res.status(404).send({ message: "Invalid bookingID" });
        if (booking.Transaction.Listing.userID !== req.userId || booking.Transaction.customerID !== req.userId)
            return res.status(401).send({ message: "Unauthorized to view another user's booking"});

        return res.send(booking)
    }).catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while fetching booking."
        });
    });
}

/** get bookings on transaction
 * expected Query param:
 * @param id transactionID 
 */
exports.getBookingsOnTransaction = (req, res) => {
    Transaction.findOne({
        where: {
            transactionID: req.query.id
        },
        include: [
            {
              model: Listing,
              attributes: ['userID']
            }
        ],
    }).then(transaction => {
        if (!transaction)
            return res.status(404).send({ message: "Invalid transactionID" });
        if (transaction.Listing.userID !== req.userId && transaction.customerID !== req.userId)
            return res.status(401).send({ message: "Unauthorized to view another user's bookings"});

        Booking.findAll({
            where: {
                transactionID: req.query.id
            }
        }).then(bookings => {
            res.send({bookings: bookings})
        }).catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while fetching bookings."
            });
        });
    })
}

/** get bookings on listing by month
 * expected Query param:
 * @param id listingID
 * @param year
 * @param month 
 */
exports.getListingBookingsByMonth = (req, res) => {
    Listing.findOne({
        where: {
            listingID: req.query.id
        }
    }).then(listing => {
        if (!listing)
            return res.status(404).send({ message: "Invalid listingID" });

        Booking.findAll({
            where: {
                [Op.or]: [
                    {[Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('startDate')), req.query.month),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('startDate')), req.query.year),
                    ]},
                    {[Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('endDate')), req.query.month),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('endDate')), req.query.year),
                    ]}
                ]
            },
            attributes: ["bookingID", "startDate", "endDate", "startTime", "endTime"],
            include: [
                {
                    model: Transaction,
                    attributes: [],
                    where: {
                        listingID: req.query.id
                    }
                }
            ]
        }).then(bookings => {
            res.send({bookings: bookings})
        }).catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while fetching bookings."
            });
        });
    })
}

/** creates booking
 * expected params in body:
 * @param transactionID
 * @param startDate
 * @param startTime (optional)
 * @param endDate
 * @param endTime (optional)
 */
exports.createBooking = (req, res) => {
    Transaction.findOne({
        where: {
            transactionID: req.body.transactionID
        }
    }).then(transaction => {
        // catch errors
        if (!transaction)
            return res.status(404).send({ message: "Invalid listingID" });
        if (transaction.customerID !== req.userId)
            return res.status(401).send({ message: "Only owner of transaction can make booking" });
        if (!req.body.startDate || !req.body.endDate)
            return res.status(400).send({ message: "startDate and endDate must be given" })
        if ((!req.body.startTime && req.body.endTime) || (req.body.startTime && !req.body.endTime))
            return res.status(400).send({ message: "startTime and endTime must both or neither be given" })
        let startDate = new Date(req.body.startDate + (req.body.startTime ? `;${req.body.startTime}` : ''))
        let endDate = new Date(req.body.endDate + (req.body.endTime ? `;${req.body.endTime}` : ''))
        console.log(`startDate`, req.body.startDate + (req.body.startTime ? `;${req.body.startTime}` : ''), startDate, `endDate`, req.body.endDate + (req.body.endTime ? `;${req.body.endTime}` : ''), endDate)
        if (startDate > endDate)
            return res.status(404).send({ message: "endDate must be later than, or equal to startDate" });
        if (startDate < new Date() || endDate < new Date())
            return res.status(400).send({ message: "can't make bookings in the past" });

        // TODO check time
        //if (req.body.startDate === req.body.endDate && req.body.startTime && req.body.endTime && )

        // check if no bookings overlap
        Booking.findAll({
            where: {
                [Op.or]: {
                    startDate: {
                        [Op.between]: [new Date(req.body.startDate), new Date(req.body.endDate)],
                    },
                    endDate: {
                        [Op.between]: [new Date(req.body.startDate), new Date(req.body.endDate)],
                    },
                    [Op.and]: {
                        startDate: {
                            [Op.lt]: new Date(req.body.startDate)
                        },
                        endDate: {
                            [Op.gt]: new Date(req.body.endDate)
                        }
                    }
                }
            },
            include: [
                {
                    model: Transaction,
                    attributes: [],
                    where: {
                        listingID: transaction.listingID
                    }
                }
            ]
        }).then(overlapping_bookings => {
            if (overlapping_bookings.length > 0){
                if (req.body.startTime){
                    for (let i = 0; i < overlapping_bookings.length; i++){
                        let b = overlapping_bookings[i];
                        let b_startDate = new Date(b.startDate + (b.startTime ? `;${b.startTime}` : ''))
                        let b_endDate = new Date(b.endDate + (b.endTime ? `;${b.endTime}` : ''))
                        if (
                            (startDate > b_startDate && startDate < b_endDate) 
                            || (b_endDate > endDate && b_startDate < endDate) 
                            || (startDate < b_startDate && endDate > b_endDate)
                        )
                            return res.status(400).send({ message: "given times overlap with existing bookings"})
                    }
                } else 
                    return res.status(400).send({ message: "given dates overlap with existing bookings"})
            }
                
            
            Booking.findAll({
                where: {
                    transactionID: req.body.transactionID,
                }
            }).then(b => {
                if (b.length >= transaction.numberOfAssets)
                    return res.status(400).send({ message: "Can't make any more bookings on this transaction"})
                
                Booking.create({
                    startDate: req.body.startDate,
                    endDate: req.body.endDate,
                    startTime: req.body.startTime,
                    endTime: req.body.endTime,
                    transactionID: req.body.transactionID
                }).then(b => {
                    res.status(200).send({booking: b});
                }).catch(err => {
                    res.status(500).send({
                        message:
                        err.message || "Some error occurred while creating booking."
                    });
                });
            })
        })
    })
}

/** update info on booking (for owner of listing)
 * expected params in body:
 * @param bookingID
 * @param info string
 */
exports.updateBookingInfo = (req, res) => {
    Booking.findOne({
        where: {
            bookingID: req.body.bookingID
        },
        include: {
            model: Transaction,
            include: {
                model: Listing,
                attributes: ['userID']
            },
        }
    }).then(Booking => {
        if (!Booking)
            return res.status(404).send({ message: "Invalid bookingID" })
        if (Booking.Transaction.Listing.userID !== req.userId)
            return res.status(401).send({ message: "Only owner of listing can update booking info" });
        Booking.info = req.body.info;
        Booking.save().then(r => {
            res.status(200).send({message: "Added info to booking"})
        }).catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while adding info to booking."
            });
        });
    }).catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while fetching booking."
        });
    });
}