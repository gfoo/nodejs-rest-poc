const express = require('express');

const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const orderCtrl = require('../controllers/orders');

router.get('/', checkAuth, orderCtrl.orders_get_all);

router.post('/', checkAuth, orderCtrl.orders_create_order);

router.get('/:orderId', checkAuth,orderCtrl.orders_get_order_by_id);

router.delete('/:orderId', checkAuth, orderCtrl.orders_delete_order_by_id);

module.exports = router;