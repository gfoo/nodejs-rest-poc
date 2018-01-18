const mongoose = require('mongoose');
const Product = require('../models/product')

exports.products_get_all =(req, res, next) => {
    Product.find()
        .select('name price _id imageUrl')
        .exec()
        .then(result => {
            console.log(result);
            const response = {
                count: result.length,
                products: result.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        imageUrl: doc.imageUrl,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
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

exports.products_create_product =  (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        imageUrl: req.file.path
    });
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Handling POST request to /products',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    imageUrl: result.imageUrl,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id
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

exports.products_get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id imageUrl')
        .exec()
        .then(result => {
            console.log("From DB", result);
            if (result) {
                res.status(200).json({
                    product: result,
                    request: {
                        type: 'GET',
                        desc: 'Get all products',
                        url: 'http://localhost:3000/products/'
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

exports.products_update_product= (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({
            _id: id
        }, {
            $set: updateOps
        })
        .exec()
        .then(result => {
            res.status(200).json({
                result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.products_delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({
            _id: id
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Deleted product!'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};