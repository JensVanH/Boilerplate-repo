const db = require("../models");
const Listing = db.Listing;
const User = db.User;
const Organization = db.Organization;
const PropertyCompany = db.PropertyCompany;

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


/**
 * Get all pending listings for the logged-in verifier
 */
exports.getPendingListings = async (req, res) => {
    try {
        const listings = await Listing.findAll({
            where: {
                verifierId: req.userId,
                status: 'pending',
            },
            include: [
                {
                    model: User,
                    as: 'verifier',
                    attributes: ['firstName', 'lastName', 'email']
                }
            ]
        });

        res.status(200).send({ listings });
    } catch (error) {
        console.error("Error fetching listings for verifier:", error);
        res.status(500).send({ message: "Error fetching listings." });
    }
};

/**
 * Approve a listing proposal
 */
exports.approveListing = async (req, res) => {
    try {
        const listingId = req.params.id;

        const listing = await Listing.findOne({
            where: {
                listingID: listingId,
                verifierId: req.userId,
            }
        });

        if (!listing) {
            return res.status(404).send({ message: "Listing not found or you are not authorized to approve it." });
        }

        await listing.update({ status: 'active' });
        res.status(200).send({ message: "Listing approved successfully." });

    } catch (error) {
        console.error("Error approving listing:", error);
        res.status(500).send({ message: "Error approving listing." });
    }
};

/**
 * Reject a listing proposal
 */
exports.rejectListing = async (req, res) => {
    try {
        const listingId = req.params.id;

        const listing = await Listing.findOne({
            where: {
                listingID: listingId,
                verifierId: req.userId,
            }
        });

        if (!listing) {
            return res.status(404).send({ message: "Listing not found or you are not authorized to reject it." });
        }

        await listing.update({ status: 'rejected' });
        res.status(200).send({ message: "Listing rejected successfully." });

    } catch (error) {
        console.error("Error rejecting listing:", error);
        res.status(500).send({ message: "Error rejecting listing." });
    }
};

/**
 * Get all listings assigned to the logged-in verifier (approved, pending, and rejected)
 */
exports.getAllListingsForVerifier = async (req, res) => {
    try {
        const listings = await User.findOne({
            where: { userID: req.userId },
            include: [
                {
                    model: Listing,
                    as: 'verifications',
                    attributes: ['listingID', 'userID', 'name', 'description', 'availableAssets', 'status', 'price', 'date', 'location', 'categories' ],
                    include: [{
                        model: User,
                        attributes: ['userName']
                    }]
                }
            ]
        });

        if (!listings) {
            return res.status(404).send({ message: "No listings found for this verifier." });
        }

        res.status(200).send({ listings: listings.verifications });
    } catch (error) {
        console.error("Error fetching all listings for verifier:", error);
        res.status(500).send({ message: "Error fetching all listings for verifier." });
    }
};

exports.getVerifierListing = async (req, res) => {
  try {
    const externalEnabled = await isExternalVerificationEnabled();

    const listing = await Listing.findOne({
      where: {
        listingID: req.params.id,
        verifierId: req.userId  // Ensure this user is the assigned verifier
      },
      include: [
        { model: User, attributes: ['userName', 'firstName', 'lastName'] },
        ...(externalEnabled
          ? [{
              model: User,
              as: 'verifier',
              attributes: ['userID', 'firstName', 'lastName', 'email', 'organizationID'],
              include: [{ model: Organization, attributes: ['name'] }]
            }]
          : [])
      ]
    });

    if (!listing) {
      return res.status(403).send({ message: "You are not authorized to access this listing or it doesn't exist." });
    }

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
      creatorFirstName: listing.User.firstName,
      creatorLastName: listing.User.lastName,
      verifierId: listing.verifierId,
    };

    if (externalEnabled && listing.verifier) {
      responseData.verifierFirstName = listing.verifier.firstName;
      responseData.verifierLastName = listing.verifier.lastName;
      responseData.verifierEmail = listing.verifier.email;
      responseData.verifierOrganization = listing.verifier.organizationID;
      responseData.verifierOrganizationName = listing.verifier.Organization?.name;
    }

    res.status(200).send(responseData);
  } catch (err) {
    console.error("Error fetching verifier's listing:", err);
    res.status(500).send({ message: "Server error." });
  }
};

