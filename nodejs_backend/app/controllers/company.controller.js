const db = require("../models");
const sequelize = require('sequelize');
const Company = db.Company;

// exports.getSelectedCompany = (req, res) => {
//     db.sequelize.query("select name from Company where selected;")
//         .then(r=> {
//             return res.status(200).send({company: r})
//         })

// };
exports.getSelectedCompany = (req, res) => {


  Company.findOne({ where: { selected: 1 } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving selected company."
      });
    });
};

exports.getAllCompanies = (req, res) => {


  Company.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving companies."
      });
    });
};

exports.setCompany = async (req, res) => {
  try {
    console.log(req.params.company)
    // Set all values of a certain field to 0
    await Company.update({ selected: 0 }, { where: {} });

    // Set the value of company given in the parameter to 1
    await Company.update({ selected: 1 }, { where: { company: req.params.company } });

    return { message: 'Update successful' };
  } catch (error) {
      throw error;
  }
};

exports.createCompany = (req, res) => {
  const companyName = req.body.company;

  Company.findOne({ where: { name: companyName } })
    .then(existingCompany => {
      if (existingCompany) {
        // Company already exists, send a response indicating that no record was added
        res.status(200).json({ message: 'Company already exists' });
      } else {
        // Company does not exist, create a new record
        Company.create({ name: companyName })
          .then(company => {
            res.status(201).json(company);
          })
          .catch(error => {
            console.error('Error creating company:', error);
            res.status(500).json({ error: 'Failed to create company' });
          });
      }
    })
    .catch(error => {
      console.error('Error checking company existence:', error);
      res.status(500).json({ error: 'Failed to check company existence' });
    });
};




