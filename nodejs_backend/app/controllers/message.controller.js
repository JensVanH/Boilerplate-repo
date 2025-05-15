const db = require("../models");
const sequelize = require('sequelize');
const Message = db.Message;
const User = db.User;

const { Op } = require("sequelize");

/** Post a message
 * expected params in body:
 * @param receiverID ID of receiving user
 * @param message
 */
exports.postMessage = (req, res) => {
    User.findOne({
        where: {
            userID: req.body.receiverID,
        },
    }).then(u => {
        // catch errors
        if (!u)
            return res.status(400).send({ message: "Invalid receiverID" });
        if (!req.body.message)
            return res.status(400).send({ message: "No message found" });

        Message.create({
            senderID: req.userId,
            receiverID: u.userID,
            message: req.body.message,
            viewed: false,
        }).then(m => {
            res.send({ message: m })
        }).catch(err => {
            res.status(500).send({ message: err.message });
        });
    })
}

/** Get lasts messages for every person contacted
 */ 
exports.getLastMessages = (req, res) => {
    // fetch all last messages send and received by user
    // Last send message AND last received message from every person will be returned (max 2 messages for each person)
    db.sequelize.query(`SELECT messageID, senderID, S.userName AS sender, receiverID, R.userName AS receiver, message, Message.createdAt, viewed FROM Message INNER JOIN (SELECT senderID, receiverID, MAX(createdAt) AS createdAt FROM Message WHERE senderID = ${req.userId} OR receiverID = ${req.userId} GROUP BY senderID, receiverID) as A USING (senderID, receiverID, createdAt) INNER JOIN User AS S ON Message.senderID = S.userID INNER JOIN User AS R ON Message.receiverID = R.userID;`)
        .then(messages => {
            let lastMessages = {};
            messages[0].forEach(m => {
                // ID of other user
                let userID = m.senderID === req.userId ? m.receiverID : m.senderID;
                // Only keep last message (to keep only one send or received message from same person)
                if (!(userID in lastMessages) || new Date(lastMessages[userID].createdAt) < new Date(m.createdAt))
                    lastMessages[userID] = m;
            });
            lastMessages = Object.values(lastMessages).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            res.status(200).send({messages: lastMessages})
        }).catch(err => {
            res.status(500).send({ message: err.message});
        })
}

/** Get all messages with another user
 * expected query param:
 * @param id userID of other user
 */
exports.getMessages = (req, res) => {
    User.findOne({
        where: {
            userID: req.query.id
        }
    }).then(u => {
        // catch errors
        if (!u)
            return res.status(404).send({ message: "Invalid receiverID" });

        Message.findAll({
            attributes: [
                'message',
                'createdAt',
                'senderID',
                'messageID'
            ],
            where: {
                [Op.or]: 
                    [{ [Op.and]: 
                            [{ senderID: req.userId },
                            { receiverID: req.query.id }]
                    },{ 
                        [Op.and]:
                            [{ senderID: req.query.id },
                            { receiverID: req.userId }]
                    }]
            },
            order: [
                'createdAt'
            ]
        }).then(m => {
            Message.update(
                { viewed: true },
                { where: { senderID: req.query.id, receiverID: req.userId} }
            ).then(_ => res.status(200).send({messages: m}))
        }).catch(err => {
            res.status(500).send({ message: err.message});
        })
    })
}

/** Get all amount fo unseen messages
 */
exports.getUnseenMessageAmount = (req, res) => {
    Message.findAll({
        where: {
            receiverID: req.userId,
            viewed: false
        }
    }).then(m => {
        res.status(200).send({ messageAmount: m.length, messages: m });
    }).catch(err => {
        res.status(500).send({ message: err.message});
    })
}