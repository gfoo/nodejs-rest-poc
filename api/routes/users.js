const express = require('express');

const router = express.Router();

const userCtrl = require('../controllers/users');

const checkAuth = require('../middleware/check-auth');

// router.get('/', (req, res, next) => {
//     User.find()
//         .exec()
//         .then(result => {
//             console.log(result);
//         });
// });

router.post('/signup', userCtrl.users_signup);

router.post('/login', userCtrl.users_login);

router.delete('/:userId', checkAuth, userCtrl.users_delete);

module.exports = router;