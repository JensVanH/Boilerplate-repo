const db = require("../models");
const config = require("../config/auth.config");
const User = db.User;
const PropertyCompany = db.PropertyCompany;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

/** creates User
 * expected params in body (not required):
 * @param firstName
 * @param lastName
 * @param organisation
 * @param password
 * @param email
 * @param userName
 * @param gender
 * @param address
 * @param birthDate
 * @param phoneNumber
 */
exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    organisation: req.body.organisation,
    authID: bcrypt.hashSync(req.body.password, 8), // hash password
    email: req.body.email,
    userName: req.body.userName,
    gender: req.body.gender,
    address: req.body.address,
    birthDate: req.body.birthDate,
    phoneNumber: req.body.phoneNumber,
    role: 'user' // <-- Set role explicitly as 'user'
  })
    .then(User => {
      res.send({ message: "User was registered successfully!" });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// Utility function to check if External Verification is enabled
const isExternalVerificationEnabled = async () => {
  const result = await PropertyCompany.findOne({
    where: {
      property: "External Verification",
    },
  });

  return !!result; // Returns true if found, false if not
};

/**
 * Sign up Verifier - Only if External Verification is enabled
 */
exports.signupVerifier = async (req, res) => {
  try {
    const externalEnabled = await isExternalVerificationEnabled();

    if (!externalEnabled) {
      return res.status(403).send({ message: "External Verification is not enabled on this platform." });
    }

    if (!req.body.organizationID) {
      return res.status(400).send({ message: "Organization ID is required." });
    }

    // Save Verifier to Database
    await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      organisation: req.body.organisation,
      authID: bcrypt.hashSync(req.body.password, 8),
      email: req.body.email,
      userName: req.body.userName,
      gender: req.body.gender,
      address: req.body.address,
      birthDate: req.body.birthDate,
      phoneNumber: req.body.phoneNumber,
      role: "verifier",
      organizationID: req.body.organizationID,
    });

    res.send({ message: "Verifier was registered successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error during registration. Please try again." });
  }
};

/**
 * expected params in body:
 * @param password
 * @param login
 */
exports.signin = (req, res) => {
  // finds user with given email or username
  User.findOne({
    where: req.body.login.includes("@") ? {
      email: req.body.login
    } : {
      userName: req.body.login
    }
  })
    .then(User => {
      if (!User)
        return res.status(404).send({ message: "User with given email / userName not found" });

      //check password
      if (!bcrypt.compareSync(req.body.password, User.authID))
        return res.status(401).send({ accessToken: null, message: "Invalid Password" });

      //create webtoken with role included
      var token = jwt.sign({ 
        id: User.userID, 
        role: User.role   // Role is now part of the token
      }, config.KEY, {
        expiresIn: 86400 // 24 hours
      });

      //send userdata
      res.status(200).send({
        id: User.userID,
        userName: User.userName,
        role: User.role,   // Send the role back as part of the response
        accessToken: token
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
