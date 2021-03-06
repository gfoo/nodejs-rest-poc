const mongoose = require('mongoose');

const Order = require('../models/order')
const Product = require('../models/product')

exports.orders_get_all = (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        .populate('product', 'name')
        .exec()
        .then(result => {
            console.log(result);
            const response = {
                count: result.length,
                products: result.map(doc => {
                    return {
                        product: doc.product,
                        quantity: doc.quantity,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                })
            };
            if (result.length > 0) {
                res.status(200).json(response);
            } else {
                res.status(404).json({
                    message: "No entries found"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.orders_create_order = (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save();
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Handling POST request to /orders',
                createdOrder: {
                    product: result.product,
                    quantity: result.quantity,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.orders_get_order_by_id = (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
        .select('product quantity _id')
        .populate('product')
        .exec()
        .then(result => {
            console.log("From DB", result);
            if (result) {
                res.status(200).json({
                    order: result,
                    request: {
                        type: 'GET',
                        desc: 'Get all orders',
                        url: 'http://localhost:3000/orders/'
                    }
                });
            } else {
                res.status(404).json({
                    message: "No valid entry for this ID"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.orders_delete_order_by_id = (req, res, next) => {
    const id = req.params.orderId;
    Order.remove({
            _id: id
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Deleted order!'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};