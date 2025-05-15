// organization.controller.js

const db = require("../models");
const Organization = db.Organization;
const User = db.User;

/**
 * Get all organizations
 */
exports.getAllOrganizations = (req, res) => {
    Organization.findAll({
        attributes: ['organizationID', 'name']
    })
    .then(organizations => {
        res.status(200).send({ organizations });
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
};

/**
 * Get verifiers of a specific organization
 * @param organizationID the ID of the organization
 */
exports.getVerifiersByOrganization = (req, res) => {
    const { organizationID } = req.params;

    Organization.findOne({
        where: {
            organizationID: organizationID
        },
        include: [
            {
                model: User,
                as: 'Users',
                attributes: ['userID', 'firstName', 'lastName', 'email'],
                where: { role: 'verifier' },
                required: false
            }
        ]
    })
    .then(organization => {
        if (!organization) {
            return res.status(404).send({ message: "Organization not found" });
        }
        res.status(200).send({ verifiers: organization.Users });
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
};
