const express = require('express');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads/');
    },
    filename: function (req, file, callback) {
        callback(null, new Date().toISOString() + '-' + file.originalname);
    },
});

const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        // accept
        callback(null, true);
    } else {
        // reject
        callback(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5Mb
    },
    fileFilter: fileFilter
});


const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const productCtrl = require('../controllers/products');

router.get('/', productCtrl.products_get_all);

router.post('/', checkAuth, upload.single('productImage'), productCtrl.products_create_product);

router.get('/:productId', productCtrl.products_get_product);

router.patch('/:productId', checkAuth, productCtrl.products_update_product);

router.delete('/:productId', checkAuth, productCtrl.products_delete_product);

module.exports = router;