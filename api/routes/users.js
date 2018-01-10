const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user')

// router.get('/', (req, res, next) => {
//     User.find()
//         .exec()
//         .then(result => {
//             console.log(result);
//         });
// });

router.post('/signup', (req, res, next) => {
    User.find({
            email: req.body.email
        })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(422) // or 409 conflict
                    .json({
                        message: 'Mail exists'
                    });
            } else {
                bcrypt.hash(req.body.password, 10, function (err, hash) {
                    if (err) {
                        res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User created'
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });
});

router.post('/login', (req, res, next) => {
    User.find({
            email: req.body.email
        })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            bcrypt.compare(req.body.password, user[0].password, function (err, result) {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        error: err
                    });
                }
                if (result) {
                    const token = jwt.sign({
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        process.env.JWT_KEY, {
                            expiresIn: "1h"
                        }
                    );
                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token
                    });
                }
                return res.status(401).json({
                    message: 'Auth failed'
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

});


router.delete('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.remove({
            _id: id
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted!'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;