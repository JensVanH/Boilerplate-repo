const db = require("../models");
const sequelize = require('sequelize');
const PropertyCompany = db.PropertyCompany

exports.getTaxonomy = (req, res) => {
    const companyName = req.query.company
    db.sequelize.query(`SELECT dimension, dimensionValue, IF(company IS NOT NULL, 1, 0) AS selected, mandatory, exclusive, orderNrDimension, TV.description FROM (SELECT D.name AS dimension, DV.name AS dimensionValue, D.description, D.mandatory, DV.exclusive, D.orderNr as orderNrDimension, DV.orderNr as orderNrValue FROM Dimension D INNER JOIN DimensionValue DV ON D.name = DV.dimension) TV LEFT JOIN (SELECT property, C.name AS company FROM PropertyCompany PC LEFT JOIN Company C ON PC.company = C.name WHERE C.name = '${companyName}') PCV ON TV.dimensionValue = PCV.property ORDER BY TV.orderNrDimension, TV.orderNrValue;`)
        .then(taxonomy => {
            return res.status(200).send({ taxonomy: taxonomy[0] })
        })
};

exports.getProperties = (req, res) => {
    const companyName = req.query.company
    db.sequelize.query(`Select D.name as dimension, DV.name as dimensionValue from Dimension D inner join DimensionValue DV on D.name = DV.dimension left Join PropertyCompany PC on DV.name = PC.property left join Company C on PC.company = C.name WHERE company = '${companyName}';`)
        .then(properties => {
            let r = {}
            properties[0].forEach(property => {
                if (property.dimension in r)
                    r[property.dimension].push(property.dimensionValue)
                else
                    r[property.dimension] = [property.dimensionValue]
            })
            res.status(200).send(r)
        }).catch(err => {
            res.status(500).send({ message: err.message });
        })
}

// exports.getConstraintsValue = (req, res) => {
//     db.sequelize.query("select * from ConstraintValue").then(constraints => {
//         return res.status(200).send({ constraints })
//     })
// };

exports.deleteProperty = (req, res) => {
    PropertyCompany.destroy({
        where: { property: req.params.property, company: req.params.company }
    })
        .catch(error => {
            res.status(500).send(error);
        });
}

exports.createProperty = (req, res) => {
    PropertyCompany.create({
        property: req.params.property,
        company: req.params.company
    }).then(l => {
        res.send({ message: "property was created successfully!" });
    })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}

exports.deleteProperties = (req, res) => {
    PropertyCompany.destroy({
        where: { company: req.body.company },
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} properties were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing properties."
            });
        });
};

exports.getConstraints = (req, res) => {
    db.sequelize.query(`SELECT value, dimension, constraintsValue FROM ConstraintValue CV left join DimensionValue DV ON CV.constraintsValue = DV.name;`)
        .then(constraints => {
            return res.status(200).send({ constraints: constraints[0] })
        })
};

