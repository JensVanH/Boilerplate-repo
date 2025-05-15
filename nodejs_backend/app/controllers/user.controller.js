const db = require("../models");
const Sequelize = require('sequelize');
const User = db.User;
var bcrypt = require("bcryptjs");
const Organization = db.Organization;

/** get userdata
 * expected query param:
 * @param id userID 
 */
exports.getUserData = async (req, res) => {
  try {
    if (!req.query.id) {
      return res.status(400).send({ message: "Missing userID in query" });
    }

    const user = await User.findOne({
      where: { userID: req.query.id },
      include: [{ model: Organization, attributes: ['name'] }]
    });

    if (!user) {
      return res.status(404).send({ message: "Invalid userID" });
    }

    res.status(200).send({
      firstName: user.firstName,
      lastName: user.lastName,
      organisation: user.organisation,
      email: user.email,
      userName: user.userName,
      gender: user.gender,
      address: user.address,
      birthDate: user.birthDate,
      phoneNumber: user.phoneNumber,
      profilePicture: user.profilePicture,
      role: user.role,
      organizationName: user.Organization?.name
    });
  } catch (err) {
    console.error("Error in getUserData:", err);
    res.status(500).send({ message: "Internal Server Error" });
  }
};


/** update userdata
 * expected query param:
 * @param id userID
 * expected params in body (not required):
 * @param firstName
 * @param lastName
 * @param organisation
 * @param email
 * @param userName
 * @param gender
 * @param address
 * @param birthDate
 * @param phoneNumber
 * @param profilePicture
 */
exports.postUserData = (req, res) => {
    // find user
    User.findOne({
        where: {
            userID: req.query.id
        }
    }).then(User => {
        // catch error
        if (!User) 
            return res.status(404).send({ message: "Invalid userID" });
        // update data
        User.firstName = req.body.firstName;
        User.lastName = req.body.lastName;
        User.organisation = req.body.organisation;
        User.email = req.body.email;
        User.userName = req.body.userName;
        User.gender = req.body.gender;
        User.address = req.body.address;
        User.birthDate = req.body.birthDate;
        User.phoneNumber = req.body.phoneNumber;
        User.profilePicture = req.body.profilePicture;
        User.save().then(user => {
            res.send({ message: "Userdata was updatet successfully!" });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
    })
};

/**
 * expected params in body:
 * @param oldPassword
 * @param newPassword
 */
exports.changePassword = (req, res) => {
    // finds user using webtoken
    User.findOne({
    where: {
        userID: req.userId
    }
    }).then(User => {
        // catch errors
        if (!User)
            return res.status(404).send({ message: "No user matching webtoken found"});
        if (!bcrypt.compareSync(req.body.oldPassword,User.authID))
            return res.status(401).send({message: "Invalid Password"});
        // save hashed password
        User.authID = bcrypt.hashSync(req.body.newPassword, 8) 
        User.save().then(_ => {
            res.send({message: "Password updated successfully"})
        })
    })
}

/**
 * expected param in query
 * @param id userID 
 */
exports.getProfilePicture = (req, res) => {
    // finds user using id in query
    User.findOne({
        where: {
            userID: req.query.id
        }
    }).then(u => {
        // catch errors
        if (!u)
            return res.status(404).send({ message: "No user matching webtoken found"});
        res.send({profilePicture: u.profilePicture})
    })
}

/**
 * expected param in query
 * @param id userID 
 */
exports.getUserRating = (req, res) => {
    // get average and amount of reviews on User
    db.sequelize.query(
        `SELECT IFNULL(AVG(score),0) AS userRating, COUNT(score) AS reviewAmount FROM Review INNER JOIN Transaction USING(transactionID) WHERE customerID = ${req.query.id} AND reviewtype='user';`,
        { type: Sequelize.QueryTypes.SELECT }
    ).then(r => {
        res.send(r[0])
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
}

/**
 * expected param in query
 * @param id userID 
 */
exports.getSellerRating = (req, res) => {
    // get average and amount of reviews on Listings owned by User
    db.sequelize.query(
        `SELECT IFNULL(AVG(score),0) AS sellerScore, COUNT(score) AS reviewAmount FROM Review INNER JOIN Transaction USING(transactionID) INNER JOIN Listing USING(ListingID) WHERE userID = ${req.query.id} AND reviewtype='listing';`,
        { type: Sequelize.QueryTypes.SELECT }
    ).then(r => {
        res.send(r[0])
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
}