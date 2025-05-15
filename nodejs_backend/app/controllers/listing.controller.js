const db = require("../models");
const sequelize = require('sequelize');
const Listing = db.Listing;
const Transaction = db.Transaction;
const User = db.User;
const Notification = db.Notification;
const Review = db.Review;
const PropertyCompany = db.PropertyCompany;
const Organization = db.Organization;

// ===================
// Check if External Verification is enabled
// ===================
const isExternalVerificationEnabled = async () => {
    const result = await PropertyCompany.findOne({
        where: {
            property: "External Verification",
        }
    });
    return !!result;
};

// returns all listings
exports.getAllListings = (req, res) => {
    const companyName = req.query.company
    
    db.sequelize.query(`SELECT l.*, r.avgScore, r.reviewAmount, U.* FROM Listing as l LEFT JOIN User as U USING (userID) LEFT JOIN (SELECT listingID, cast(AVG(score) as decimal(3,2)) as avgScore, IFNULL(COUNT(score), 0) as reviewAmount FROM Review as r INNER JOIN Transaction as t USING (transactionID)  WHERE r.reviewType = 'listing' GROUP BY t.listingID) as r USING(listingID)  WHERE company = '${companyName}'`)
        .then(l => {
            return res.status(200).send({listings: l[0]})
        })
};

exports.getActiveListings = (req, res) => {
    const companyName = req.query.company
    
    db.sequelize.query(`SELECT 
        l.*, 
        r.avgScore, 
        r.reviewAmount, 
        u.*, 
        v.firstName AS verifierFirstName, 
        v.lastName AS verifierLastName, 
        o.name AS verifierOrganizationName
      FROM Listing AS l
      LEFT JOIN User AS u ON l.userID = u.userID
      LEFT JOIN User AS v ON l.verifierId = v.userID
      LEFT JOIN Organization AS o ON v.organizationID = o.organizationID
      LEFT JOIN (
        SELECT 
          listingID, 
          CAST(AVG(score) AS DECIMAL(3,2)) AS avgScore, 
          IFNULL(COUNT(score), 0) AS reviewAmount 
        FROM Review AS r 
        INNER JOIN Transaction AS t USING (transactionID)  
        WHERE r.reviewType = 'listing' 
        GROUP BY t.listingID
      ) AS r USING(listingID)
      WHERE l.company = '${companyName}' 
        AND l.status = 'active' 
        AND (l.availableAssets <> 0 OR ISNULL(l.availableAssets))`)
        .then(l => {
            return res.status(200).send({listings: l[0]})
        })
};
 
/** get all listings made by given user
 * expected query param:
 * @param id userID 
 */

exports.getUserListings = async (req, res) => {
  try {
    const listings = await Listing.findAll({
      where: {
        userID: req.query.id,
        company: req.query.company
      },
      include: [
        {
          model: User,
          as: 'verifier',
          attributes: ['userID', 'firstName', 'lastName'],
          include: [
            {
              model: Organization,
              attributes: ['name']
            }
          ]
        }
      ]
    });

    // Map results to include readable verifier + organization info
    const formattedListings = listings.map(listing => ({
      ...listing.toJSON(),
      verifierFirstName: listing.verifier?.firstName || null,
      verifierLastName: listing.verifier?.lastName || null,
      verifierOrganizationName: listing.verifier?.Organization?.name || null
    }));

    return res.status(200).send({ listings: formattedListings });

  } catch (err) {
    console.error("Error fetching user listings:", err);
    res.status(500).send({ message: "Error fetching user listings" });
  }
};


// ===================
// Create Listing
// ===================
exports.createListing = async (req, res) => {
    try {
        const externalEnabled = await isExternalVerificationEnabled();

        let status = 'active'; // Default to active for internal verification
        let verifierId = null;

        if (externalEnabled) {
            if (!req.body.verifierId) {
                return res.status(400).send({
                    message: "External Verification is enabled, please select a verifier."
                });
            }
            status = 'pending';   // Mark as pending if external
            verifierId = req.body.verifierId;
        }

        const newListing = await Listing.create({
            name: req.body.name,
            description: req.body.description,
            availableAssets: req.body.availableAssets,
            date: req.body.date,
            price: req.body.price,
            time: req.body.time,
            picture: req.body.picture,
            location: req.body.location,
            categories: req.body.categories,
            status: status,
            file: req.body.file,
            link: req.body.link,
            userID: req.userId,
            company: req.body.companyName,
            verifierId: verifierId
        });

        res.send({ message: "Listing was created successfully!", listingID: newListing.listingID });
    } catch (err) {
        console.error("Error during listing creation:", err);
        res.status(500).send({ message: err.message });
    }
};



// ===================
// Get Listing Data
// ===================
exports.getListing = async (req, res) => {
    try {
        const externalEnabled = await isExternalVerificationEnabled();

        // Find the listing
        const listing = await Listing.findOne({
            where: {
                listingID: req.query.id
            },
            include: [
                { model: User, attributes: ['userName'] }, // Fetch creator
                ...(externalEnabled ? [{ model: User, as: 'verifier', attributes: ['userID', 'firstName', 'lastName', 'email', 'organizationID'], 
                                        include: [{ model: Organization, attributes: ['name'] }] // <-- Include Organization 
                    }] : [])
            ]
        });

        if (!listing) {
            return res.status(404).send({ message: "Invalid listingID" });
        }

        // Prepare the response object
        const responseData = {
            listingID: listing.listingID,
            name: listing.name,
            description: listing.description,
            availableAssets: listing.availableAssets,
            date: listing.date,
            price: listing.price,
            picture: listing.picture,
            location: listing.location,
            categories: listing.categories,
            status: listing.status,
            file: listing.file,
            link: listing.link,
            userID: listing.userID,
            userName: listing.User.userName,
            verifierId: listing.verifierId,
        };

        // If External Verification is enabled, add verifier details
        if (externalEnabled) {
            responseData.verifierFirstName = listing.verifier.firstName;
            responseData.verifierLastName = listing.verifier.lastName;
            responseData.verifierEmail = listing.verifier.email;
            responseData.verifierOrganization = listing.verifier.organizationID;
            responseData.verifierOrganizationName = listing.verifier.Organization?.name;
        }
        res.status(200).send(responseData);
    } catch (err) {
        console.error("Error fetching listing data:", err);
        res.status(500).send({ message: "Error fetching listing data." });
    }
};

/** update listingdata
 * expected query param:
 * @param id listingID
 * expected params in body (not required):
 * @param name
 * @param description
 * @param availableAssets
 * @param date
 * @param price
 * @param picture // image in base64 format
 * @param location
 * @param categories
 * @param file
 */
// ===================
// Update Listing Data
// ===================
exports.postListing = async (req, res) => {
    try {
        console.log("Incoming listing update for ID:", req.query.id);
        console.log("User making request:", req.userId);
        console.log("Request body:", req.body);
        
        const listing = await Listing.findOne({
            where: {
                listingID: req.query.id
            }
        });

        if (!listing) {
            return res.status(404).send({ message: "Invalid listingID" });
        }

        if (req.userId !== listing.userID) {
            return res.status(401).send({ message: "Unauthorized to edit another user's listing" });
        }    

        // Only allow verifierID update if External Verification is enabled
        const externalEnabled = await isExternalVerificationEnabled();



        
        if (externalEnabled && req.body.verifierId) {
            listing.verifierId = req.body.verifierId;
            listing.organizationID = req.body.organizationID;
        }

        // Update the listing fields
        listing.name = req.body.name;
        listing.description = req.body.description;
        listing.availableAssets = req.body.availableAssets;
        listing.date = req.body.date;
        listing.price = req.body.price;
        listing.picture = req.body.picture;
        listing.file = req.body.file;
        listing.link = req.body.link;
        listing.location = req.body.location;
        listing.categories = req.body.categories;

        console.log("Final listing values before save:", {
            name: listing.name,
            organizationID: listing.organizationID,
            verifierId: listing.verifierId
        });


        // Save the listing
        await listing.save();

        res.send({ message: "Listing was updated successfully!" });
    } catch (err) {
        console.error("Error updating listing:", err);
        res.status(500).send({ message: "Error updating listing." });
    }
};

exports.cancelListing = (req, res) => {
    Listing.findOne({
        where: {
            listingID: req.query.id
        }
    }).then(Listing => {
        // catch errors
        if (!Listing)
            return res.status(404).send({ message: "Invalid listingID" });
        if (req.userId !== Listing.userID)
            return res.status(401).send({ message: "Unauthorized to cancel another user's listing"});
        // cancel all transactions
        Transaction.findAll({
            where: {
                listingID: Listing.listingID
            }
        }).then(transactions => {
            // cancel all transactions of listing
            transactions.forEach(t => {
                t.status = 'cancelled';
                Notification.create({
                    transactionID: t.transactionID,
                    viewed: false,
                    userID: t.customerID,
                    type: 'cancellation'
                }).then(_ => t.save())
            });
            // cancel listing
            Listing.status = 'cancelled'
            Listing.save().then(_ => {
                res.send({ message: "Listing was cancelled successfully!" });
            })
        })
        
    })
}

exports.soldListingStatus = (req, res) => {
    Listing.findOne({
        where: {
            listingID: req.query.id
        }
    }).then(listing => {
        if (!listing) {
            console.log("Listing not found");
            return res.status(404).send({ message: "Listing not found" });
        }

        // Update the listing status to 'sold'
        listing.status = 'sold';

        listing.save().then(_ => {
            console.log("Listing status updated");
            res.status(200).send({ message: "Listing marked as sold successfully." });
        }).catch(error => {
            console.log("Error updating listing status:", error);
            res.status(500).send({ message: "Error updating listing status." });
        });

    }).catch(error => {
        console.log("Error finding listing:", error);
        res.status(500).send({ message: "Error finding listing." });
    });
};
