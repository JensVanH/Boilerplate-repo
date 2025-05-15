const db = require("../models");
const User = db.User;

/** checks if email is already in use
 * expected param in body:
 * @param email
 */
checkDuplicateEmail = (req, res, next) => {
  // find user with email
  User.findOne({ where: { email: req.body.email }}).then(User => {
    // catch error
    if (User)
      return res.status(400).send({ message: "Failed! Email is already in use!" });
    next();
  });
};

const verifySignUp = {
    checkDuplicateEmail: checkDuplicateEmail,
};
  
module.exports = verifySignUp;